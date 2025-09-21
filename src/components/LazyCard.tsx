import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { mergeClasses } from "../utils/mergeClasses";
import { LoadingCard } from "./LoadingCard";
import { ResultCard } from "./ResultCard";

interface Props {
	className?: string;
	title: string;
	resultUrl: string;
	category: string;
	websiteTitle: string;
	searchUrl: string;
	websiteStarred?: boolean;
	year?: string;
	imageUrl?: string;
	altText?: string;
}

export function LazyCard({ className = "", ...props }: Props) {
	const { ref, inView } = useInView({
		triggerOnce: true, // Only trigger once when the element enters the viewport
		threshold: 0, // When 10% of the element is visible
		rootMargin: "200px 0px", // Start loading when it's 200px away from the viewport (vertical)
	});

	const [hasBeenInView, setHasBeenInView] = useState(false);

	// Once in view, set a state to keep it rendered even if it scrolls out of view.
	// This prevents components that have already loaded from being unmounted and re-mounted.
	if (inView && !hasBeenInView) {
		setHasBeenInView(true);
	}

	return (
		<div ref={ref} className={mergeClasses("", className)}>
			{hasBeenInView ? (
				<ResultCard className={"w-full h-full"} {...props}></ResultCard>
			) : (
				<LoadingCard className={"w-full h-full"} />
			)}
		</div>
	);
}
