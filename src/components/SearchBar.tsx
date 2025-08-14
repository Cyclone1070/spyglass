import { useEffect, useRef, useState } from "react";
import SearchSvg from "../assets/search.svg?react";
import { mergeClasses } from "../utils/mergeClasses";

interface Props {
	className?: string;
}

export function SearchBar({ className }: Props) {
	const categories = [
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
	];
	const [currentCategory, setCurentCategory] = useState<string>(
		categories[0],
	);
	// states for horizontal scroll
	const scrollContainerRef = useRef<HTMLDivElement | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const dragStartX = useRef(0);
	const preventSelection = useRef(false);

	useEffect(() => {
		function handleMouseMove(e: MouseEvent) {
			if (scrollContainerRef.current) {
				const scrollLeft = scrollContainerRef.current.scrollLeft;
				scrollContainerRef.current.scrollLeft =
					scrollLeft - e.movementX;
				if (
					!preventSelection.current &&
					Math.abs(e.clientX - dragStartX.current) > 5
				) {
					preventSelection.current = true;
				}
			}
		}
		function handleMouseUp() {
			if (isDragging) {
				setIsDragging(false);
			}
		}
		if (isDragging) {
			window.addEventListener("mousemove", handleMouseMove);
			window.addEventListener("mouseup", handleMouseUp);
		} else {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", handleMouseUp);
		}

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", handleMouseUp);
		};
	}, [isDragging]);

	// This effect will scroll the active button into view when the currentCategory changes.
	useEffect(() => {
		if (scrollContainerRef.current) {
			const container = scrollContainerRef.current;
			// Find the button that is currently active.
			// We can find it by its text content matching the currentCategory state.
			const activeButton = Array.from(container.children).find(
				(child) => child.textContent === currentCategory,
			) as HTMLElement | undefined;

			if (activeButton) {
				// The magic happens here
				activeButton.scrollIntoView({
					behavior: "smooth", // For a smooth scrolling animation
					block: "nearest", // Vertically align to the nearest edge
					inline: "center", // Horizontally align in the center
				});
			}
		}
	}, [currentCategory]);

	return (
		<div
			className={mergeClasses(
				"flex flex-col items-center gap-2 md:gap-4",
				className,
			)}
		>
			<form
				className={
					`flex shadow-md rounded-md p-2 text-(--text) md:text-lg w-full max-w-150 ` +
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
				ref={scrollContainerRef}
				onMouseDown={(e) => {
					if (preventSelection.current) {
						preventSelection.current = false;
					}
					setIsDragging(true);
					dragStartX.current = e.clientX;
				}}
				className={`flex gap-4 w-full max-w-190 overflow-auto scrollbar-hide p-2`}
			>
				{categories.map((category) => (
					<button
						key={category}
						className={
							`p-1 px-2 border-b whitespace-nowrap cursor-pointer select-none ` +
							`${currentCategory === category ? `border-(--accent) text-(--accent)` : `border-transparent text-(--text)`}`
						}
						onMouseUp={() => {
							if (preventSelection.current) return;
							setCurentCategory(category);
						}}
					>
						{category}
					</button>
				))}
			</div>
		</div>
	);
}
