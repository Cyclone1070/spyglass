import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useMemo } from "react";
import { useLocation } from "react-router";
import { twMerge } from "tailwind-merge";
import { getCategoryWheelDirection } from "../utils/categoryWheel";

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
			"Games Download",
			"Anime",
			"Abandonware/ROM",
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
	}, [emblaApi, location.state?.referer, categories, setCurrentCategory]);

	// A plain wheel scrolls the bar linearly; modified wheels stay with the browser.
	useEffect(() => {
		if (!emblaApi) return;

		const viewport = emblaApi.rootNode();
		const container = emblaApi.containerNode();
		const reducedMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		);
		let lastScrollAt = 0;
		let transitionTimer: number | undefined;

		const clearTransition = () => {
			if (transitionTimer !== undefined) {
				window.clearTimeout(transitionTimer);
				transitionTimer = undefined;
			}
			container.classList.remove("category-wheel-scrolling");
		};

		const onWheel = (event: WheelEvent) => {
			const direction = getCategoryWheelDirection(
				event,
				emblaApi.canScrollPrev(),
				emblaApi.canScrollNext(),
			);
			if (direction === 0) return;

			event.preventDefault();

			const now = performance.now();
			if (now - lastScrollAt < 120) return;
			lastScrollAt = now;

			if (reducedMotion.matches) {
				clearTransition();
			} else {
				container.classList.add("category-wheel-scrolling");
				if (transitionTimer !== undefined) {
					window.clearTimeout(transitionTimer);
				}
				transitionTimer = window.setTimeout(clearTransition, 240);
			}

			if (direction > 0) emblaApi.scrollNext(true);
			else emblaApi.scrollPrev(true);
		};

		const stopTransition = () => clearTransition();

		viewport.addEventListener("wheel", onWheel, { passive: false });
		viewport.addEventListener("pointerdown", stopTransition);
		viewport.addEventListener("touchstart", stopTransition, { passive: true });
		return () => {
			viewport.removeEventListener("wheel", onWheel);
			viewport.removeEventListener("pointerdown", stopTransition);
			viewport.removeEventListener("touchstart", stopTransition);
			clearTransition();
		};
	}, [emblaApi]);

	return (
		<div
			ref={emblaRef}
			className={twMerge(`p-2 overflow-hidden w-full`, className)}
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
