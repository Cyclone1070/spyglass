import { motion } from "motion/react";
import React from "react";

interface Props {
	className?: string;
	buttonBgColor?: string;
	children: React.ReactNode;
	hoverOverlayTheme?: "darker" | "lighter";
	onClick: () => void;
}

export function ButtonWithOverlay({ className, children, buttonBgColor, hoverOverlayTheme, onClick }: Props) {
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
			style={buttonBgColor ? { backgroundColor: buttonBgColor } : {}}
		>
			{/* darken background overlay */}
			{hoverOverlayTheme ? (
				<motion.div
					variants={{
						default: { backgroundColor: "#00000000" },
						hover: { backgroundColor: hoverOverlayTheme === "darker" ? "#00000029" : "#ffffff29" },
						active: { backgroundColor: hoverOverlayTheme === "darker" ? "#00000039" : "#ffffff39" },
					}}
					initial="default"
					whileHover={isActive ? "active" : "hover"}
					animate={isActive ? "active" : "default"}
					className="absolute z-30 top-0 left-0 w-full h-full rounded-[inherit]"
				></motion.div>
			) : null}
			{children}
		</button>
	);
}
