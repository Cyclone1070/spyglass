import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import type { Result } from "../../types";
import useIsOnScreen from "../hooks/useIsOnScreen";
import { mergeClasses } from "../utils/mergeClasses";
import { ResultCard } from "./ResultCard";
import { SearchBar } from "./SearchBar";

interface Props {
	className?: string;
}

export function SearchResult({ className }: Props) {
	const API_BASE_URL = "http://localhost:52500";
	const [currentCategory, setCurrentCategory] = useState("All");

	const [searchParams] = useSearchParams();
	const query = searchParams.get("q");

	const [results, setResults] = useState<Result[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Create a ref to attach to the element you want to watch
	const myElementRef = useRef<HTMLDivElement>(null);

	// Use the custom hook. isOnScreen will be true/false
	const isOnScreen = useIsOnScreen(myElementRef);

	// Fetch the data stream from the server
	useEffect(() => {
		// Don't fetch if there's no query.
		if (!query) {
			setIsLoading(false);
			setResults([]);
			return;
		}

		// Create an AbortController for this specific fetch request.
		const controller = new AbortController();

		// Reset the state for every new search.
		setIsLoading(true);
		setError(null);
		setResults([]);

		async function fetchStream() {
			try {
				if (!query) return;
				const searchUrl = new URL(`${API_BASE_URL}/api/search`);
				searchUrl.searchParams.append("q", query);
				// searchUrl.searchParams.append('category', category); // If you use it

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
								setResults((prev) => [...prev, result]);
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
						completeJsonLines.split("\n").forEach((line) => {
							if (line.trim()) {
								try {
									const result = JSON.parse(line) as Result;
									setResults((prev) => [...prev, result]);
								} catch {
									console.warn(
										"Failed to parse JSON object from stream:",
										line,
									);
								}
							}
						});
					}
				}
			} catch (e) {
				if (e instanceof Error && e.name === "AbortError") {
					// We know it's a fetch cancellation. Do nothing.
					console.log("Fetch was aborted by cleanup.");
				} else {
					// Handle all other, real errors.
					console.error("Search failed:", e);
					setError("Something went wrong. Please try again.");
				}
			} finally {
				setIsLoading(false);
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

	return (
		<div
			className={mergeClasses(
				`relative flex flex-col items-center px-4 py-2 gap-15`,
				className,
			)}
		>
			<AnimatePresence>
				{isOnScreen === false && (
					<motion.div
						className={`w-full fixed top-0 pt-2`}
						initial={{ y: -200 }}
						animate={{ y: 0 }}
						exit={{ y: -200 }}
						transition={{
							type: "spring",
							stiffness: 300,
							damping: 30,
							duration: 0.2,
						}}
					>
						<SearchBar
							className={`w-full`}
							initialQuery={searchParams.get("q") || undefined}
							smallBar
						/>
					</motion.div>
				)}
			</AnimatePresence>

			<SearchBar
				ref={myElementRef}
				className={`w-full`}
				initialQuery={searchParams.get("q") || undefined}
				currentCategory={currentCategory}
				setCurrentCategory={setCurrentCategory}
				smallBar
			/>
			<div className={`flex flex-wrap justify-center gap-4`}>
				{[1, 2, 3, 4, 5, 6, 7, 23, 42, 423, 212].map((result) => (
					<ResultCard key={result} />
				))}
				{results.map((result) => (
					<ResultCard key={result.resultUrl} />
				))}
			</div>
			{error}
		</div>
	);
}
