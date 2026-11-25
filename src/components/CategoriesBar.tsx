import { useEffect, useMemo, useRef } from "react";
import { useLocation } from "react-router";
import { twMerge } from "tailwind-merge";
import {
	accumulateCategoryOverscroll,
	getCategoryOverscrollOffset,
	getDragScrollLeft,
	isCategoryDrag,
} from "../utils/categoryDrag";
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

	// Native wheel/trackpad scrolling plus mouse drag; touch stays native.
	useEffect(() => {
		const scroller = scrollRef.current;
		if (!scroller) return;

		const track = scroller.firstElementChild as HTMLElement | null;
		const reducedMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		);
		let pointerId: number | null = null;
		let startX = 0;
		let startScrollLeft = 0;
		let dragging = false;
		let suppressClick = false;
		let clickResetTimer: number | undefined;
		let bounceAnimation: Animation | null = null;
		let wheelBounceTimer: number | undefined;
		let wheelOverscroll = 0;

		const clearWheelBounceTimer = () => {
			if (wheelBounceTimer !== undefined) {
				window.clearTimeout(wheelBounceTimer);
				wheelBounceTimer = undefined;
			}
		};

		const cancelBounceAnimation = () => {
			bounceAnimation?.cancel();
			bounceAnimation = null;
		};

		const clearBounce = () => {
			clearWheelBounceTimer();
			cancelBounceAnimation();
			wheelOverscroll = 0;
			if (track) track.style.transform = "";
		};

		const springTrackBack = () => {
			clearWheelBounceTimer();
			if (!track || track.style.transform === "") {
				wheelOverscroll = 0;
				return;
			}

			const from = track.style.transform;
			track.style.transform = "";
			wheelOverscroll = 0;

			if (reducedMotion.matches) return;

			cancelBounceAnimation();
			const animation = track.animate(
				[{ transform: from }, { transform: "translateX(0)" }],
				{
					duration: 360,
					easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
				},
			);
			bounceAnimation = animation;
			animation.onfinish = () => {
				if (bounceAnimation !== animation) return;
				bounceAnimation = null;
				track.style.transform = "";
			};
			animation.oncancel = () => {
				if (bounceAnimation === animation) bounceAnimation = null;
			};
		};

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
				// Consume Shift+wheel even at the ends so the browser's
				// previous-page gesture cannot fire over the bar.
				event.preventDefault();
				const rawScrollLeft = scroller.scrollLeft + delta;
				scroller.scrollLeft = Math.max(
					0,
					Math.min(maxScroll, rawScrollLeft),
				);

				if (!track) return;

				clearWheelBounceTimer();
				cancelBounceAnimation();
				wheelOverscroll = accumulateCategoryOverscroll(
					wheelOverscroll,
					rawScrollLeft,
					maxScroll,
				);
				track.style.transform =
					wheelOverscroll === 0
						? ""
						: `translateX(${wheelOverscroll}px)`;

				if (wheelOverscroll !== 0) {
					wheelBounceTimer = window.setTimeout(() => {
						wheelBounceTimer = undefined;
						springTrackBack();
					}, 160);
				}
				return;
			}

			// Horizontal trackpad gestures only take over when the bar can move.
			if (
				(delta < 0 && scroller.scrollLeft > 0) ||
				(delta > 0 && scroller.scrollLeft < maxScroll)
			) {
				event.preventDefault();
				if (wheelOverscroll !== 0 || bounceAnimation) clearBounce();
				scroller.scrollLeft = Math.max(
					0,
					Math.min(maxScroll, scroller.scrollLeft + delta),
				);
			}
		};

		const onPointerDown = (event: PointerEvent) => {
			if (event.pointerType !== "mouse" || event.button !== 0) return;

			clearBounce();
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
			const maxScroll = scroller.scrollWidth - scroller.clientWidth;
			const rawScrollLeft = getDragScrollLeft(
				startScrollLeft,
				startX,
				event.clientX,
			);
			scroller.scrollLeft = Math.max(
				0,
				Math.min(maxScroll, rawScrollLeft),
			);

			if (track) {
				const offset = getCategoryOverscrollOffset(rawScrollLeft, maxScroll);
				track.style.transform =
					offset === 0 ? "" : `translateX(${offset}px)`;
			}
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

			springTrackBack();

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

		scroller.addEventListener("wheel", onWheel, { passive: false });
		scroller.addEventListener("pointerdown", onPointerDown);
		window.addEventListener("pointermove", onPointerMove);
		window.addEventListener("pointerup", stopDragging);
		window.addEventListener("pointercancel", stopDragging);
		scroller.addEventListener("click", onClickCapture, true);

		return () => {
			if (clickResetTimer !== undefined) {
				window.clearTimeout(clickResetTimer);
			}
			clearBounce();
			scroller.classList.remove("is-dragging");
			scroller.removeEventListener("wheel", onWheel);
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
