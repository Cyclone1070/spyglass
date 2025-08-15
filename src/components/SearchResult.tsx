import { useSearchParams } from "react-router";
import { mergeClasses } from "../utils/mergeClasses";
import { SearchBar } from "./SearchBar";

interface Props {
	className?: string;
}

export function SearchResult({ className }: Props) {
	const [searchParams] = useSearchParams();
	return (
		<div
			className={mergeClasses(
				`flex flex-col items-center px-4 py-2`,
				className,
			)}
		>
			<SearchBar
				className={`w-full h-10`}
				initialQuery={searchParams.get("q") || undefined}
			/>
		</div>
	);
}
