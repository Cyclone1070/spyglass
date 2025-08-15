import { NavLink, useLocation } from "react-router";
import DarkModeSvg from "../assets/dark-mode.svg?react";
import HomeSvg from "../assets/home.svg?react";
import LightModeSvg from "../assets/light-mode.svg?react";
import SpyglassHorizontalSvg from "../assets/spyglass-horizontal.svg?react";
import { useTheme } from "../context/useTheme";
import { mergeClasses } from "../utils/mergeClasses";

interface Props {
	className?: string;
}

export function NavBar({ className }: Props) {
	const { isDarkMode, toggleTheme } = useTheme();
	const navButtonClass =
		"cursor-pointer p-2 relative rounded-md w-12 h-12 shadow-none hover:bg-(--bg-hover) active:bg-(--bg-hover) shrink-0 ";
	const location = useLocation();

	return (
		<div
			className={mergeClasses(
				`w-full p-4 gap-4 flex justify-between items-center`,
				className,
			)}
		>
			<NavLink to="/" className={navButtonClass}>
				<HomeSvg />
			</NavLink>

			{location.pathname !== "/" && (
				<SpyglassHorizontalSvg className="h-10" />
			)}

			<button className={navButtonClass} onClick={toggleTheme}>
				{isDarkMode ? <DarkModeSvg /> : <LightModeSvg />}
			</button>
		</div>
	);
}
