import { Result, SearchType } from "@/app/types";
import { ResultCard } from "./ResultCard";
import Spyglass from "/public/Spyglass.svg";

interface Props {
	resultList: Result[] | null;
	className?: string;
	searchTypeList: SearchType[];
}
export function SearchResults({ resultList, className, searchTypeList }: Props) {
	return (
		<>
			{resultList ? (
				/* page container */
				<div className={`flex flex-wrap justify-center gap-6 ${className}`}>
					{/* item cards */}
					{resultList.map((result) => (
						<ResultCard key={result.link} searchTypeList={searchTypeList} result={result}/>
					))}
				</div>
			) : (
				<Spyglass className={`relative h-full w-[min(20rem,100%)] text-[--icon] ${className}`} />
			)}
		</>
	);
}
