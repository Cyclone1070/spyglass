import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { twMerge } from "tailwind-merge";
import { useStreamResults } from "../hooks/useStreamResults";
import { CategoriesBar } from "./CategoriesBar";
import { LazyCard } from "./LazyCard";
import { LoadingCard } from "./LoadingCard";

interface Props {
	className?: string;
}

export function SearchResult({ className = "" }: Props) {
	const [currentCategory, setCurrentCategory] = useState("All");

	const [searchParams] = useSearchParams();
	const query = searchParams.get("q");

	const categoriesRef = useRef<HTMLDivElement | null>(null);

	const { results, error, isLoading } = useStreamResults(query);

	const filteredResults = useMemo(() => {
		// If the category is "All", return the original, unfiltered array.
		if (currentCategory === "All") {
			return results;
		}
		// Otherwise, return a new array containing only the matching items.
		return results.filter((result) => result.category === currentCategory);
	}, [results, currentCategory]); // The dependencies for the memoization

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<div
			className={twMerge(
				`relative flex flex-col items-center gap-2 pt-2 px-4`,
				className,
			)}
		>
			<CategoriesBar
				className={`w-full max-w-165`}
				currentCategory={currentCategory}
				setCurrentCategory={setCurrentCategory}
				ref={categoriesRef}
			/>
			<div
				className={
					"w-full max-w-250 grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] justify-center justify-items-center items-end gap-y-12 gap-x-10 mt-15 " +
					"md:gap-y-20"
				}
			>
				{filteredResults.map((result) => (
					<LazyCard
						className={`w-full h-full`}
						key={result.resultUrl}
						title={result.title}
						resultUrl={result.resultUrl}
						category={result.category}
						websiteTitle={result.websiteTitle}
						searchUrl={result.searchUrl}
						websiteStarred={result.websiteStarred}
						imageUrl={result.imageUrl}
						altText={result.altText}
						query={query}
					/>
				))}
				{!error &&
					filteredResults.length === 0 &&
					isLoading &&
					Array.from({ length: 12 }).map((_, i) => (
						<LoadingCard key={i} className={"w-full h-full"} />
					))}

				{!error && filteredResults.length === 0 && !isLoading && (
					<h1 className={"text-lg p-10"}>No Results Found</h1>
				)}
				{error && (
					<h1
						className={
							"text-lg p-10 text-red-600 dark:text-red-400"
						}
					>
						{error}
					</h1>
				)}
			</div>
		</div>
	);
}
