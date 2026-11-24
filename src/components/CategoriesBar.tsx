import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useMemo } from "react";
import { useLocation } from "react-router";
import { twMerge } from "tailwind-merge";
import { getCategoryWheelAction } from "../utils/categoryWheel";
import {
	CategoryWheelQueue,
	getWheelStepDuration,
} from "../utils/categoryWheelQueue";

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

	// Shift + wheel (and horizontal trackpad gestures) moves the bar; plain wheel stays with the page.
	useEffect(() => {
		if (!emblaApi) return;

		const viewport = emblaApi.rootNode();
		const container = emblaApi.containerNode();
		const reducedMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		);
		const wheelQueue = new CategoryWheelQueue(4);
		let stepTimer: number | undefined;

		const clearTransition = () => {
			if (stepTimer !== undefined) {
				window.clearTimeout(stepTimer);
				stepTimer = undefined;
			}
			wheelQueue.cancel();
			container.classList.remove("category-wheel-scrolling");
			container.style.transitionDuration = "";
		};

		const startStep = (direction: -1 | 1) => {
			const canScroll =
				direction > 0 ? emblaApi.canScrollNext() : emblaApi.canScrollPrev();
			if (!canScroll) {
				clearTransition();
				return;
			}

			const engine = emblaApi.internalEngine();
			const startTarget = engine.target.get();

			container.classList.add("category-wheel-scrolling");
			if (direction > 0) emblaApi.scrollNext(true);
			else emblaApi.scrollPrev(true);

			const distance = Math.abs(engine.target.get() - startTarget);
			if (distance === 0) {
				clearTransition();
				return;
			}

			const duration = getWheelStepDuration(distance);
			container.style.transitionDuration = `${duration}ms`;

			stepTimer = window.setTimeout(() => {
				stepTimer = undefined;
				const nextDirection = wheelQueue.finish();
				if (nextDirection === 0) {
					container.classList.remove("category-wheel-scrolling");
					container.style.transitionDuration = "";
					return;
				}
				startStep(nextDirection);
			}, duration + 10);
		};

		const runNextStep = () => {
			if (stepTimer !== undefined) return;

			const direction = wheelQueue.next();
			if (direction === 0) {
				container.classList.remove("category-wheel-scrolling");
				return;
			}
			startStep(direction);
		};

		const onWheel = (event: WheelEvent) => {
			const action = getCategoryWheelAction(
				event,
				emblaApi.canScrollPrev(),
				emblaApi.canScrollNext(),
			);
			if (!action.handled) return;

			// Consume Shift+wheel even at the ends so the browser's previous-page
			// gesture cannot fire while the pointer is over the bar.
			event.preventDefault();

			if (action.direction === 0) return;

			if (reducedMotion.matches) {
				if (action.direction > 0) emblaApi.scrollNext(true);
				else emblaApi.scrollPrev(true);
				return;
			}

			wheelQueue.enqueue(action.direction);
			runNextStep();
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
