import { useNavigate, useSearchParams } from "react-router";
import SearchSvg from "../assets/search.svg?react";
import { mergeClasses } from "../utils/mergeClasses";

interface Props {
	className?: string;
	initialQuery?: string;
	placeholder?: string;
	ref?: React.Ref<HTMLFormElement>;
	autoFocus?: boolean;
}

export function SearchBar({
	className = "",
	initialQuery,
	placeholder,
	autoFocus,
}: Props) {
	const navigate = useNavigate();
	const [currentSearchParams] = useSearchParams();

	return (
		<form
			onSubmit={handleSearchSubmit}
			className={mergeClasses(
				`flex shadow-[0_0_0.5rem_0_hsl(0,0%,0%,0.25)] items-center rounded-full px-4 md:text-lg max-w-150 ` +
					`dark:shadow-none bg-(--bg-layer-2)`,
				className,
			)}
		>
			<button className={`w-4 h-4 aspect-square cursor-pointer`}>
				<SearchSvg className={`text-(--accent)`} />
			</button>
			<input
				autoFocus={autoFocus}
				required
				autoComplete="off"
				defaultValue={initialQuery}
				placeholder={placeholder}
				type="search"
				name="q"
				className={`flex-1 outline-none pl-4`}
			/>
		</form>
	);

	function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const newQuery = formData.get("q")?.toString();
		const currentQuery = currentSearchParams.get("q");
		if (!newQuery?.trim() || newQuery.trim() === currentQuery) return;
		// redirect to /search with query and category as parameters
		const searchParams = new URLSearchParams({
			q: newQuery,
		});

		navigate(`/search?${searchParams.toString()}`);
	}
}
