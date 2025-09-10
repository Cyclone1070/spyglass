import useEmblaCarousel from "embla-carousel-react";
import { forwardRef, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router";
import SearchSvg from "../assets/search.svg?react";
import { mergeClasses } from "../utils/mergeClasses";

interface Props {
	className?: string;
	initialQuery?: string;
	placeholder?: string;
	currentCategory?: string;
	setCurrentCategory?: React.Dispatch<React.SetStateAction<string>>;
	smallBar?: boolean;
}

export const SearchBar = forwardRef<HTMLDivElement, Props>(
	(
		{
			className,
			initialQuery,
			placeholder,
			currentCategory,
			setCurrentCategory,
			smallBar,
		}: Props,
		ref,
	) => {
		const categories = useMemo(
			() => [
				"All",
				"Books",
				"Movies",
				"Abandonware/ROM",
				"Games Download",
				"Games Repack",
				"Windows Software",
				"Mac",
				"Android",
				"iOS",
				"Linux Games",
			],
			[],
		);

		// useEmblaCarousel hook to create a carousel for categories
		const [emblaRef, emblaApi] = useEmblaCarousel({
			align: "start",
			dragFree: true,
		});

		const navigate = useNavigate();
		const [currentSearchParams] = useSearchParams();

		// remember last category in localStorage and scroll to it
		useEffect(() => {
			if (!currentCategory || !setCurrentCategory) return;
			// get last category from localStorage
			const lastCategory = localStorage.getItem("searchCategory");
			if (lastCategory) {
				setCurrentCategory(lastCategory);
				if (emblaApi) {
					emblaApi.scrollTo(categories.indexOf(lastCategory));
				}
			}
		}, [emblaApi, setCurrentCategory]);

		return (
			<>
				<div
					className={mergeClasses(
						`relative flex flex-col w-full max-w-150 items-center`,
						className,
					)}
					ref={ref}
				>
					<form
						onSubmit={handleSearchSubmit}
						className={
							`relative flex shadow-[0_0_0.5rem_0_hsl(0,0%,0%,0.25)] rounded-md p-2 pl-4 md:text-lg w-[90%] ${smallBar ? "h-10" : "h-12"} ` +
							` dark:shadow-none dark:bg-(--bg-hover)`
						}
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
					{currentCategory && setCurrentCategory && (
						<div
							ref={emblaRef}
							className={`p-2 overflow-hidden w-full`}
						>
							<div className={`flex gap-4`}>
								{categories.map((category) => (
									<button
										type="button"
										key={category}
										className={
											`p-1 px-2 border-b-2 whitespace-nowrap cursor-pointer select-none ` +
											`${currentCategory === category ? `border-(--accent) text-(--accent)` : `border-transparent`}`
										}
										onClick={() => {
											setCurrentCategory(category);
											localStorage.setItem(
												"searchCategory",
												category,
											);
										}}
									>
										{category}
									</button>
								))}
							</div>
						</div>
					)}
				</div>
			</>
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
	},
);
