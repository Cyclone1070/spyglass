import { NavLink, useLocation, useSearchParams } from "react-router";
import DarkModeSvg from "../assets/dark-mode.svg?react";
import HomeSvg from "../assets/home.svg?react";
import LightModeSvg from "../assets/light-mode.svg?react";
import { useTheme } from "../context/useTheme";
import { mergeClasses } from "../utils/mergeClasses";
import { SearchBar } from "./SearchBar";
import SpyglassHorizontalSvg from "../assets/spyglass-horizontal.svg?react";

interface Props {
	className?: string;
}

export function NavBar({ className = "" }: Props) {
	const [searchParams] = useSearchParams();
	const { isDarkMode, toggleTheme } = useTheme();
	const navButtonClass =
		"cursor-pointer p-1 relative rounded-md w-10 h-10 shadow-none hover:bg-(--bg-hover) active:bg-(--bg-hover) shrink-0 " +
		"md:w-12 md:h-12 md:p-2 ";
	const location = useLocation();

	return (
		<div
			className={mergeClasses(
				"w-full p-2 gap-4 grid grid-cols-[2.5rem_1fr_2.5rem] justify-items-center items-center bg-(--bg) sticky -top-14 z-10 " +
					"md:px-6 md:top-0",
				className,
			)}
		>
			<NavLink to="/" className={navButtonClass + "col-start-1"}>
				<HomeSvg />
			</NavLink>

			{location.pathname !== "/" && (
				<>
					<SearchBar
						className={
							"w-full max-w-140 h-10 sticky top-2 row-start-2 col-span-3 " +
							"md:row-start-1 md:col-span-1 md:col-start-2"
						}
						placeholder="Enter your search"
						initialQuery={searchParams.get("q") || undefined}
					/>
					<SpyglassHorizontalSvg className={"h-10 " + "md:hidden"} />
				</>
			)}

			<button
				className={navButtonClass + "col-start-3"}
				onClick={toggleTheme}
			>
				{isDarkMode ? <DarkModeSvg /> : <LightModeSvg />}
			</button>
		</div>
	);
}
