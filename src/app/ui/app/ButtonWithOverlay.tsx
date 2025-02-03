import { motion } from "motion/react";
import React from "react";

interface Props {
	className?: string;
	children: React.ReactNode;
	hoverOverlayTheme?: "fontColor" | "bgColor";
	onClick: () => void;
}

export function ButtonWithOverlay({ className, children,  hoverOverlayTheme, onClick }: Props) {
	const [isActive, setIsActive] = React.useState(false);

	return (
		<button
			type="button"
			/* set to active on click */
			onMouseDown={() => {
				setIsActive(true);
			}}
			onMouseUp={() => {
				setIsActive(false);
				onClick();
			}}
			className={`relative ${className}`}
		>
			{/* darken background overlay */}
			{hoverOverlayTheme ? (
				<motion.div
					variants={{
						default: { opacity: 0 },
						hover: { opacity: 0.16 },
						active: { opacity: 0.22 },
					}}
					initial="default"
					whileHover={isActive ? "active" : "hover"}
					animate={isActive ? "active" : "default"}
					className={`absolute z-30 top-0 left-0 w-full h-full rounded-[inherit] ${hoverOverlayTheme === "fontColor" ? "bg-[--foreground]" : "bg-[--background]"}`}
				></motion.div>
			) : null}
			{children}
		</button>
	);
}
