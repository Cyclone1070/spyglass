import DarkModeSvg from "../assets/dark-mode.svg?react";
import HomeSvg from "../assets/home.svg?react";
import LightModeSvg from "../assets/light-mode.svg?react";
import { useTheme } from "../context/useTheme";
import { mergeClasses } from "../utils/mergeClasses";

interface Props {
	className?: string;
}

export function NavBar({ className }: Props) {
	const { isDarkMode, toggleTheme } = useTheme();
	const navButtonClass =
		"cursor-pointer p-2 relative rounded-md w-12 h-12 shadow-none hover:bg-(--bg-hover) active:bg-(--bg-hover)";
	return (
		<div
			className={mergeClasses(
				`w-full p-4 flex justify-between`,
				className,
			)}
		>
			<button className={navButtonClass}>
				<HomeSvg className={`text-(--text)`} />
			</button>

			<button className={navButtonClass} onClick={toggleTheme}>
				{isDarkMode ? (
					<DarkModeSvg className={`text-(--text)`} />
				) : (
					<LightModeSvg className={`text-(--text)`} />
				)}
			</button>
		</div>
	);
}
