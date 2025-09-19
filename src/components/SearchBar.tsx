import { useNavigate, useSearchParams } from "react-router";
import SearchSvg from "../assets/search.svg?react";
import { mergeClasses } from "../utils/mergeClasses";

interface Props {
	className?: string;
	initialQuery?: string;
	placeholder?: string;
	ref?: React.Ref<HTMLFormElement>;
}

export function SearchBar({
	className = "",
	initialQuery,
	placeholder,
}: Props) {
	const navigate = useNavigate();
	const [currentSearchParams] = useSearchParams();

	return (
		<form
			onSubmit={handleSearchSubmit}
			className={mergeClasses(
				`sticky flex shadow-[0_0_0.5rem_0_hsl(0,0%,0%,0.25)] rounded-md p-2 pl-4 md:text-lg w-full max-w-150 h-12 ` +
					`dark:shadow-none bg-(--bg-layer-2)`,
				className,
			)}
		>
			<input
				required
				autoComplete="off"
				defaultValue={initialQuery}
				placeholder={placeholder}
				type="text"
				name="q"
				className={`flex-1 outline-none`}
			/>
			<button
				className={`w-auto h-full aspect-square p-1 cursor-pointer`}
			>
				<SearchSvg className={`text-(--accent)`} />
			</button>
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
