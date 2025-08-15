import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useMemo, useState } from "react";
import SearchSvg from "../assets/search.svg?react";
import { mergeClasses } from "../utils/mergeClasses";

interface Props {
	className?: string;
}

export function SearchBar({ className }: Props) {
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
			"Android apps",
			"IOS apps",
		],
		[],
	);
	const [currentCategory, setCurentCategory] = useState<string>(
		categories[0],
	);
	const [emblaRef, emblaApi] = useEmblaCarousel({
		align: "start",
		dragFree: true,
	});
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
		<div
			className={mergeClasses(
				"flex flex-col items-center gap-2 md:gap-4",
				className,
			)}
		>
			<form
				className={
					`flex shadow-[0_0_0.5rem_0_hsl(0,0%,0%,0.25)] rounded-md p-2 pl-4 md:text-lg w-full max-w-150 ` +
					` dark:shadow-none dark:bg-(--bg-hover)`
				}
			>
				<input
					type="text"
					name="query"
					className={`flex-1 outline-none`}
				/>
				<button className={`w-9 h-9 p-1 cursor-pointer`}>
					<SearchSvg />
				</button>
			</form>
			<div
				ref={emblaRef}
				className={`w-full p-2 max-w-190 overflow-hidden`}
			>
				<div className={`flex gap-4`}>
					{categories.map((category) => (
						<button
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
		</div>
	);
}
