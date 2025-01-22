import { motion } from "motion/react";
import { useEffect, useRef } from "react";

interface Props {
	className?: string;
	children?: React.ReactNode;
}
export function DropDownContainer({ className, children }: Props) {
	const dropDownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function calculatePosition() {
			const dropDown = dropDownRef.current;
			if (!dropDown) return;

			// Get initial position from CSS (centered below trigger)
			const parent = dropDown.parentElement;
			console.log(parent);
			if (!parent) return;

			// Get viewport measurements
			const dropDownRect = dropDown.getBoundingClientRect();
			const parentRect = parent.getBoundingClientRect();
			console.log("drop down", dropDownRect);
			console.log("parent", parentRect);
			const viewportWidth = window.innerWidth;
			const viewportHeight = window.innerHeight;

			let desiredLeft = parentRect.left + parentRect.width / 2 - dropDownRect.width / 2;
			let desiredTop = parentRect.bottom;

			// Horizontal overflow check
			desiredLeft = Math.min(Math.max(0, desiredLeft), viewportWidth - dropDownRect.width - 8);

			// Vertical overflow check
			desiredTop = Math.min(Math.max(0, desiredTop), viewportHeight - dropDownRect.height - 8);

			// Apply adjusted positioning
			dropDown.style.left = `${desiredLeft}px`;
			dropDown.style.top = `${desiredTop}px`;
		}
		calculatePosition();
		window.addEventListener("resize", calculatePosition);
		window.addEventListener("scroll", calculatePosition);
		return () => {
			window.removeEventListener("resize", calculatePosition);
			window.removeEventListener("scroll", calculatePosition);
		}
	}, []);

	return (
		<motion.div
			ref={dropDownRef}
			variants={{
				hidden: { opacity: 0, y: "-0.5rem" },
				visible: { opacity: 1, y: 0 },
			}}
			initial="hidden"
			animate="visible"
			exit="hidden"
			className={`fixed z-50 my-3 left-1/2 top-1/2 ${className}`}
		>
			{children}
		</motion.div>
	);
}
