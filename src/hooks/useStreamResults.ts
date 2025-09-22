import { useEffect, useState } from "react";
import type { Result } from "../../types";

const API_BASE_URL = "http://localhost:5250";

export function useStreamResults(query: string | null) {
    const [results, setResults] = useState<Result[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch the data stream from the server
    useEffect(() => {
        // Don't fetch if there's no query.
        if (!query) {
            setIsLoading(false);
            return;
        }

        // Create an AbortController for this specific fetch request.
        const controller = new AbortController();

        async function fetchStream() {
            try {
                if (!query) return;
                const searchUrl = new URL(`${API_BASE_URL}/api/search`);
                searchUrl.searchParams.append("q", query);

                // Pass the controller's signal to the fetch call.
                const response = await fetch(searchUrl, {
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                if (!response.body) {
                    return;
                }

                const reader = response.body.getReader();
                const decoder = new TextDecoder();

                let buffer = "";

                while (true) {
                    const { done, value } = await reader.read();
                    // The stream is finished. We need to process any leftover data in the buffer.
                    // This handles the case where the last JSON object was not followed by a newline.
                    if (done) {
                        if (buffer.trim()) {
                            try {
                                const result = JSON.parse(buffer) as Result;
                                setResults((prev) =>
                                    mergeSortedResults(prev, [result]),
                                );
                            } catch {
                                console.warn(
                                    "Failed to parse final JSON object from buffer:",
                                    buffer,
                                );
                            }
                        }
                        break; // Exit the loop
                    }

                    // Append the decoded chunk to the buffer.
                    buffer += decoder.decode(value, { stream: true });
                    // Split up into json objects and check if there is any unfinished data in the buffer
                    const lastNewlineIndex = buffer.lastIndexOf("\n");
                    // Wait until we have at least one complete line (ending with a newline)
                    if (lastNewlineIndex !== -1) {
                        // ...take the complete part of the buffer up to that last newline.
                        const completeJsonLines = buffer.substring(
                            0,
                            lastNewlineIndex,
                        );

                        // Keep the rest (the incomplete part) in the buffer for the next iteration.
                        buffer = buffer.substring(lastNewlineIndex + 1);

                        // Process all the complete lines we extracted.
                        const newResults = completeJsonLines
                            .split("\n")
                            .reduce<Result[]>((accumulator, line) => {
                                if (line.trim()) {
                                    try {
                                        accumulator.push(JSON.parse(line));
                                    } catch {
                                        console.warn(
                                            "Failed to parse JSON object from stream:",
                                            line,
                                        );
                                    }
                                }
                                return accumulator;
                            }, []);

                        if (newResults.length > 0) {
                            setResults((prev) =>
                                mergeSortedResults(prev, newResults),
                            );
                        }
                    }
                }
                setIsLoading(false);
            } catch (e) {
                if (e instanceof Error && e.name === "AbortError") {
                    // We know it's a fetch cancellation. Do nothing.
                    console.log("Fetch was aborted by cleanup.");
                } else {
                    // Handle all other, real errors.
                    console.error("Search failed:", e);
                    setError("Something went wrong. Please try again.");
                }
            }
        }

        fetchStream();

        // 5. The Cleanup Function: This is the magic.
        // React runs this function when the component unmounts OR before the effect runs again.
        // If the user types a new search, this function will abort the *previous* fetch request.
        return () => {
            controller.abort();
        };
    }, [query]); // The effect re-runs whenever the query or category changes.

    return { results, isLoading, error };
}

function mergeSortedResults(prev: Result[], newResults: Result[]): Result[] {
    // 1. Sort only the new results
    newResults.sort(function (a, b) {
        return b.score - a.score;
    });

    const merged = [];
    let i = 0; // Pointer for prev (already sorted)
    let j = 0; // Pointer for newResults (now sorted)

    // 2. Merge the two sorted arrays
    while (i < prev.length && j < newResults.length) {
        if (prev[i].score >= newResults[j].score) {
            merged.push(prev[i]);
            i++;
        } else {
            merged.push(newResults[j]);
            j++;
        }
    }

    // Add any remaining elements from prev
    while (i < prev.length) {
        merged.push(prev[i]);
        i++;
    }

    // Add any remaining elements from newResults
    while (j < newResults.length) {
        merged.push(newResults[j]);
        j++;
    }

    return merged;
}

