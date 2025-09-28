import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useMemo } from "react";
import { useLocation } from "react-router";
import { mergeClasses } from "../utils/mergeClasses";

interface Props {
	className?: string;
	currentCategory: string;
	setCurrentCategory: React.Dispatch<React.SetStateAction<string>>;
	ref?: React.Ref<HTMLDivElement>;
}

export function CategoriesBar({
	className = "",
	currentCategory,
	setCurrentCategory,
	ref,
}: Props) {
	const location = useLocation();
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
		],
		[],
	);

	// useEmblaCarousel hook to create a carousel for categories
	const [emblaRef, emblaApi] = useEmblaCarousel({
		align: "start",
		dragFree: true,
	});

	// remember last category in localStorage and scroll to it
	useEffect(() => {
		if (!currentCategory || !setCurrentCategory) return;
		// if coming from home page, reset to "All"
		if (location.state?.referer === "/") {
			setCurrentCategory("All");
			localStorage.setItem("searchCategory", "All");
			if (emblaApi) {
				emblaApi.scrollTo(0);
			}
			return;
		}
		// get last category from localStorage
		const lastCategory = localStorage.getItem("searchCategory");
		if (lastCategory) {
			setCurrentCategory(lastCategory);
			if (emblaApi) {
				emblaApi.scrollTo(categories.indexOf(lastCategory));
			}
		}
	}, [emblaApi, location.state?.referer]);

	return (
		<div
			ref={emblaRef}
			className={mergeClasses(`p-2 overflow-hidden w-full`, className)}
		>
			<div ref={ref} className={`flex gap-4`}>
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
							localStorage.setItem("searchCategory", category);
						}}
					>
						{category}
					</button>
				))}
			</div>
		</div>
	);
}
