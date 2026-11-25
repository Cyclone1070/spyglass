import { useEffect, useMemo, useRef } from "react";
import { useLocation } from "react-router";
import { twMerge } from "tailwind-merge";
import { getDragScrollLeft, isCategoryDrag } from "../utils/categoryDrag";

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

	// Native wheel/trackpad scrolling is untouched; mouse drag is the only enhancement.
	useEffect(() => {
		const scroller = scrollRef.current;
		if (!scroller) return;

		let pointerId: number | null = null;
		let startX = 0;
		let startScrollLeft = 0;
		let dragging = false;
		let suppressClick = false;
		let clickResetTimer: number | undefined;

		const onPointerDown = (event: PointerEvent) => {
			if (event.pointerType !== "mouse" || event.button !== 0) return;

			pointerId = event.pointerId;
			startX = event.clientX;
			startScrollLeft = scroller.scrollLeft;
			dragging = false;
		};

		const onPointerMove = (event: PointerEvent) => {
			if (event.pointerId !== pointerId) return;
			if (!dragging && !isCategoryDrag(startX, event.clientX)) return;

			if (!dragging) {
				dragging = true;
				if (
					document.activeElement instanceof HTMLElement &&
					scroller.contains(document.activeElement)
				) {
					document.activeElement.blur();
				}
				scroller.classList.add("is-dragging");
				try {
					scroller.setPointerCapture(event.pointerId);
				} catch {
					// The pointer can end between the threshold and capture.
				}
			}

			event.preventDefault();
			scroller.scrollLeft = getDragScrollLeft(
				startScrollLeft,
				startX,
				event.clientX,
			);
		};

		const stopDragging = (event: PointerEvent) => {
			if (event.pointerId !== pointerId) return;

			if (dragging) {
				suppressClick = true;
				if (clickResetTimer !== undefined) {
					window.clearTimeout(clickResetTimer);
				}
				clickResetTimer = window.setTimeout(() => {
					suppressClick = false;
					clickResetTimer = undefined;
				}, 0);
			}

			if (scroller.hasPointerCapture(event.pointerId)) {
				scroller.releasePointerCapture(event.pointerId);
			}
			scroller.classList.remove("is-dragging");
			pointerId = null;
			dragging = false;
		};

		const onClickCapture = (event: MouseEvent) => {
			if (!suppressClick) return;

			event.preventDefault();
			event.stopPropagation();
			suppressClick = false;
			if (clickResetTimer !== undefined) {
				window.clearTimeout(clickResetTimer);
				clickResetTimer = undefined;
			}
		};

		scroller.addEventListener("pointerdown", onPointerDown);
		window.addEventListener("pointermove", onPointerMove);
		window.addEventListener("pointerup", stopDragging);
		window.addEventListener("pointercancel", stopDragging);
		scroller.addEventListener("click", onClickCapture, true);

		return () => {
			if (clickResetTimer !== undefined) {
				window.clearTimeout(clickResetTimer);
			}
			scroller.classList.remove("is-dragging");
			scroller.removeEventListener("pointerdown", onPointerDown);
			window.removeEventListener("pointermove", onPointerMove);
			window.removeEventListener("pointerup", stopDragging);
			window.removeEventListener("pointercancel", stopDragging);
			scroller.removeEventListener("click", onClickCapture, true);
		};
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
