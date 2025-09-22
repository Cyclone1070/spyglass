import { motion } from "motion/react";
import { useState } from "react";
import { mergeClasses } from "../utils/mergeClasses";

import AndroidSvg from "../assets/android.svg?react";
import BookSvg from "../assets/book.svg?react";
import GameSvg from "../assets/game.svg?react";
import IosSvg from "../assets/ios.svg?react";
import MacSvg from "../assets/mac.svg?react";
import MovieSvg from "../assets/movie.svg?react";
import RepackSvg from "../assets/repack.svg?react";
import StarSvg from "../assets/star.svg?react";
import WindowsSvg from "../assets/windows.svg?react";

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
	query?: string;
}

export function ResultCard({
	className = "",
	title,
	resultUrl,
	category,
	websiteTitle,
	searchUrl,
	websiteStarred,
	imageUrl,
	altText,
	query,
}: Props) {
	const [imageError, setImageError] = useState(false);
	const [isCardHovered, setIsCardHovered] = useState(false);
	const [isBadgeHovered, setIsBadgeHovered] = useState(false);
	const formattedSearchUrl = query
		? searchUrl.replace("{0}", encodeURIComponent(query))
		: null;
	return (
		<>
			<div
				className={mergeClasses(
					`flex flex-col justify-end items-center`,
					className,
				)}
			>
				{/* image */}
				<motion.a
					animate={isCardHovered ? { scale: 1.05 } : { scale: 1 }}
					target="_blank"
					href={resultUrl}
					className={`rounded-md cursor-pointer relative shadow-md/35`}
					onMouseLeave={() => setIsCardHovered(false)}
					onMouseEnter={() => setIsCardHovered(true)}
				>
					{/* card badges */}
					<a
						target="_blank"
						href={formattedSearchUrl || ""}
						onClick={(e) => {
							e.stopPropagation();
							if (!query) {
								e.preventDefault();
							}
						}}
						className="absolute bottom-2 right-0 mx-2 text-xs max-w-full overflow-hidden text-white bg-blue-600 p-1 px-2 rounded-md shadow-md/35 hover:underline"
						onMouseEnter={() => setIsBadgeHovered(true)}
						onMouseLeave={() => setIsBadgeHovered(false)}
					>
						{websiteTitle}
					</a>
					{websiteStarred && (
						<StarSvg className="text-yellow-400 absolute top-2 right-0 mx-2 w-6 h-6 glow" />
					)}
					{/* image */}
					{imageUrl && !imageError ? (
						<img
							className={`max-w-60 max-h-60 rounded-md`}
							src={imageUrl}
							alt={altText || title}
							onError={() => setImageError(true)}
						/>
					) : (
						<div
							className={
								`w-48 h-48 rounded-md flex justify-center items-center ` +
								`bg-(--bg-layer-1)`
							}
						>
							{category === "Books" && (
								<BookSvg className="w-30 h-30 text-blue-600" />
							)}
							{(category === "Movies" ||
								category === "Anime") && (
								<MovieSvg className="w-30 h-30 text-blue-600" />
							)}
							{category === "Games Repack" && (
								<RepackSvg className="w-30 h-30 text-blue-600" />
							)}
							{(category === "Games Download" ||
								category === "Abandonware/ROM") && (
								<GameSvg className="w-30 h-30 text-blue-600" />
							)}
							{category === "Windows Software" && (
								<WindowsSvg className="w-30 h-30 text-blue-600" />
							)}
							{category === "Mac" && (
								<MacSvg className="w-30 h-30 text-blue-600" />
							)}
							{category === "iOS" && (
								<IosSvg className="w-30 h-30 text-blue-600" />
							)}
							{category === "Android" && (
								<AndroidSvg className="w-30 h-30 text-blue-600" />
							)}
						</div>
					)}
				</motion.a>
				{/* title */}
				<div className={`w-full overflow-hidden flex justify-center`}>
					<a
						target="_blank"
						href={resultUrl}
						title={title}
						className={
							"font-semibold text-center line-clamp-2 h-18 pt-4 " +
							"md:h-11 md:line-clamp-1 " +
							`${isCardHovered && !isBadgeHovered ? "underline text-(--accent)" : ""}`
						}
						onMouseEnter={() => setIsCardHovered(true)}
						onMouseLeave={() => setIsCardHovered(false)}
					>
						{title}
					</a>
				</div>
			</div>
		</>
	);
}
