import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

interface Props {
	staticId?: string;
	buttonContent?: React.ReactNode;
	className?: string;
	buttonBgColor?: string;
	currentActiveButtonId: string | null;
	setCurrentActiveButtonId: React.Dispatch<React.SetStateAction<string | null>>;
	children: React.ReactNode;
}

export function DropDownButton({
	staticId,
	buttonContent,
	className,
	buttonBgColor,
	currentActiveButtonId,
	setCurrentActiveButtonId,
	children,
}: Props) {
	const id = useRef(uuidv4());
	if (staticId) {
		id.current = staticId;
	}
	const dropdownAreaRef = useRef<HTMLDivElement>(null);

	/* reset all trackers if outside click is detected */
	useEffect(() => {
		function outsideClickHandler(event: MouseEvent) {
			if (dropdownAreaRef.current && !dropdownAreaRef.current.contains(event.target as Node) && currentActiveButtonId === id.current) {
				setCurrentActiveButtonId(null);
			}
		}
		document.addEventListener("mousedown", outsideClickHandler);
		return () => {
			document.removeEventListener("mousedown", outsideClickHandler);
		};
	}, [dropdownAreaRef, setCurrentActiveButtonId, currentActiveButtonId]);

	return (
		<div className={`relative`} ref={dropdownAreaRef}>
			<button
				type="button"
				/* set to active on click */
				onClick={() => {
					if (currentActiveButtonId !== id.current) {
						setCurrentActiveButtonId(id.current);
					} else {
						setCurrentActiveButtonId(null);
					}
				}}
				className={`relative ${className}`}
				style={buttonBgColor ? { backgroundColor: buttonBgColor } : {}}
			>
				{/* darken background overlay */}
				<motion.div
					variants={{
						default: { backgroundColor: "#00000000" },
						hover: { backgroundColor: "#00000029" },
						active: { backgroundColor: "#00000039" },
					}}
					initial="default"
					whileHover={currentActiveButtonId === id.current ? "active" : "hover"}
					animate={currentActiveButtonId === id.current ? "active" : "default"}
					className="absolute z-30 top-0 left-0 w-full h-full rounded-[inherit]"
				></motion.div>
				{buttonContent}
			</button>
			<AnimatePresence>
				{currentActiveButtonId === id.current && children}
			</AnimatePresence>
		</div>
	);
}
