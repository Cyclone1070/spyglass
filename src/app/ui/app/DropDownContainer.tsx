import { motion } from "motion/react";

interface Props {
	className?: string;
	children?: React.ReactNode;
}
export function DropDownContainer({ className, children }: Props) {
	return (
		<motion.div
			variants={{
				hidden: { opacity: 0, y: "-0.5rem" },
				visible: { opacity: 1, y: 0 },
			}}
			initial="hidden"
			animate="visible"
			exit="hidden"
			className={`absolute z-50 top-12 left-1/2 ${className}`}
			style={{ x: "-50%" }}
		>
			{children}
		</motion.div>
	);
}