import { useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { useStreamResults } from "../hooks/useStreamResults";
import { mergeClasses } from "../utils/mergeClasses";
import { CategoriesBar } from "./CategoriesBar";
import { LazyCard } from "./LazyCard";

interface Props {
	className?: string;
}

export function SearchResult({ className = "" }: Props) {
	const [currentCategory, setCurrentCategory] = useState("All");

	const [searchParams] = useSearchParams();
	const query = searchParams.get("q");

	const categoriesRef = useRef<HTMLDivElement | null>(null);

	const { results, error } = useStreamResults(query);

	return (
		<div
			className={mergeClasses(
				`relative flex flex-col items-center px-4`,
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
					"w-full max-w-250 grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] justify-center justify-items-center items-end gap-y-12 gap-x-6 mt-15 " +
					"md:gap-y-20"
				}
			>
				{results.map((result) => (
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
			</div>
			{error}
		</div>
	);
}
