import { useEffect, useState } from "react";
import { NavLink, useLocation, useSearchParams } from "react-router";
import DarkModeSvg from "../assets/dark-mode.svg?react";
import HomeSvg from "../assets/home.svg?react";
import LightModeSvg from "../assets/light-mode.svg?react";
import SpyglassHorizontalSvg from "../assets/spyglass-horizontal.svg?react";
import { useTheme } from "../context/useTheme";
import { useIsMobile } from "../hooks/useIsMobile";
import { mergeClasses } from "../utils/mergeClasses";
import { SearchBar } from "./SearchBar";
import ArrowUpSvg from "../assets/arrow-up.svg?react";

interface Props {
	className?: string;
}

export function NavBar({ className = "" }: Props) {
	const [searchParams] = useSearchParams();
	const { isDarkMode, toggleTheme } = useTheme();
	const isMobile = useIsMobile();
	const navButtonClass =
		"cursor-pointer p-1 relative rounded-md w-10 h-10 shadow-none hover:bg-(--bg-hover) active:bg-(--bg-hover) shrink-0 " +
		"md:w-12 md:h-12 md:p-2 ";
	const location = useLocation();

	const [isScrollUpVisible, setIsScrollUpVisible] = useState(false);

	useEffect(() => {
		const rem = parseFloat(
			getComputedStyle(document.documentElement).fontSize,
		); // usually 16

		const handleScroll = () => {
			setIsScrollUpVisible(window.scrollY > 70 * rem); // show after 300px scroll
		};

		window.addEventListener("scroll", handleScroll);

		// run once in case user already scrolled
		handleScroll();

		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<div
			className={mergeClasses(
				"w-full p-2 gap-4 grid grid-cols-[2.5rem_1fr_2.5rem] justify-items-center items-center bg-(--bg) z-10 " +
					"md:px-6 md:top-0 md:sticky",
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
			{isMobile && isScrollUpVisible && (
				<button
					onClick={() =>
						window.scrollTo({ top: 0, behavior: "smooth" })
					}
					className="fixed top-20 right-8 bg-(--bg-layer-2) hover:bg-(--bg-hover) active:bg-(--bg-hover) w-10 h-10 p-2 rounded-full shadow-lg/35 "
				>
					<ArrowUpSvg />
				</button>
			)}
		</div>
	);
}
