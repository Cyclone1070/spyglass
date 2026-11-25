import { useEffect, useMemo, useRef } from "react";
import { useLocation } from "react-router";
import { twMerge } from "tailwind-merge";
import { getCategoryWheelScroll } from "../utils/categoryWheel";

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
	const scrollRef = useRef<HTMLDivElement>(null);
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

	// remember last category in localStorage and scroll to it
	useEffect(() => {
		const scroller = scrollRef.current;
		if (!scroller) return;

		const scrollToCategory = (category: string) => {
			const button = [...scroller.querySelectorAll("button")].find(
				(candidate) => candidate.textContent?.trim() === category,
			);
			if (!button) return;

			const paddingLeft =
				Number.parseFloat(getComputedStyle(scroller).paddingLeft) || 0;
			const left =
				button.getBoundingClientRect().left -
				scroller.getBoundingClientRect().left +
				scroller.scrollLeft -
				paddingLeft;
			scroller.scrollLeft = Math.max(0, left);
		};

		// if coming from home page, reset to "All"
		if (location.state?.referer === "/") {
			setCurrentCategory("All");
			localStorage.setItem("searchCategory", "All");
			scroller.scrollLeft = 0;
			return;
		}

		// get last category from localStorage
		const lastCategory = localStorage.getItem("searchCategory");
		if (lastCategory) {
			setCurrentCategory(lastCategory);
			scrollToCategory(lastCategory);
		}
	}, [location.state?.referer, setCurrentCategory]);

	// Shift + wheel and horizontal trackpad gestures scroll the native track.
	useEffect(() => {
		const scroller = scrollRef.current;
		if (!scroller) return;

		const onWheel = (event: WheelEvent) => {
			const action = getCategoryWheelScroll(event);
			if (!action.handled) return;

			const maxScroll = scroller.scrollWidth - scroller.clientWidth;
			const multiplier =
				event.deltaMode === 1
					? 16
					: event.deltaMode === 2
						? scroller.clientWidth
						: 1;
			const delta = action.delta * multiplier;

			if (event.shiftKey) {
				// Consume Shift+wheel even at the ends so the browser's previous-page
				// gesture cannot fire while the pointer is over the bar.
				event.preventDefault();
				scroller.scrollLeft += delta;
				return;
			}

			// Horizontal trackpad gestures only take over when the bar can move.
			if (
				(delta < 0 && scroller.scrollLeft > 0) ||
				(delta > 0 && scroller.scrollLeft < maxScroll)
			) {
				event.preventDefault();
				scroller.scrollLeft = Math.max(
					0,
					Math.min(maxScroll, scroller.scrollLeft + delta),
				);
			}
		};

		scroller.addEventListener("wheel", onWheel, { passive: false });
		return () => scroller.removeEventListener("wheel", onWheel);
	}, []);

	return (
		<div
			ref={scrollRef}
			className={twMerge("category-scroll p-2 overflow-x-auto w-full", className)}
		>
			<div ref={ref} className="flex w-max gap-4">
				{categories.map((category) => (
					<button
						type="button"
						key={category}
						className={
							`p-1 px-2 border-b-2 whitespace-nowrap cursor-pointer select-none shrink-0 ` +
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
