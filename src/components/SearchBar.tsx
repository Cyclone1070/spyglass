import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useMemo, useState } from "react";
import SearchSvg from "../assets/search.svg?react";
import { mergeClasses } from "../utils/mergeClasses";

interface Props {
	className?: string;
	initialQuery?: string;
	placeholder?: string;
}

export function SearchBar({ className, initialQuery, placeholder }: Props) {
	const categories = useMemo(
		() => [
			"All",
			"Books",
			"Movies",
			"Games Download",
			"Games Repack",
			"Abandonware/ROM",
			"Mac Games",
			"Linux Games",
			"Windows Software",
			"Mac Software",
			"Android",
			"IOS",
		],
		[],
	);
	const [currentCategory, setCurentCategory] = useState<string>(
		categories[0],
	);

	// useEmblaCarousel hook to create a carousel for categories
	const [emblaRef, emblaApi] = useEmblaCarousel({
		align: "start",
		dragFree: true,
	});

	// remember last category in localStorage and scroll to it
	useEffect(() => {
		const lastCategory = localStorage.getItem("searchCategory");
		if (lastCategory) {
			setCurentCategory(lastCategory);
			if (emblaApi) {
				emblaApi.scrollTo(categories.indexOf(lastCategory));
			}
		}
	}, [categories, emblaApi]);

	return (
		<>
			<form
				action="/search"
				className={mergeClasses(
					`relative flex shadow-[0_0_0.5rem_0_hsl(0,0%,0%,0.25)] rounded-md p-2 pl-4 md:text-lg w-full max-w-150 ` +
						` dark:shadow-none dark:bg-(--bg-hover)`,
					className,
				)}
			>
				<input
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
				<div
					ref={emblaRef}
					className={`p-2 overflow-hidden absolute top-full mt-2 inset-x-0 md:-inset-x-10`}
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
									setCurentCategory(category);
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
			</form>
		</>
	);
}
