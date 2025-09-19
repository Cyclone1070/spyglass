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
import WindowsSvg from "../assets/windows.svg?react";

interface Props {
	className?: string;
	title: string;
	resultUrl: string;
	category: string;
	websiteTitle: string;
	websiteUrl: string;
	websiteStarred?: boolean;
	year?: string;
	imageUrl?: string;
	altText?: string;
}

export function ResultCard({
	className = "",
	title,
	resultUrl,
	category,
	websiteTitle,
	websiteUrl,
	websiteStarred,
	year,
	imageUrl,
	altText,
}: Props) {
	const [imageError, setImageError] = useState(false);
	const [isHovered, setIsHovered] = useState(false);
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
					animate={isHovered ? { y: -10 } : { y: 0 }}
					href={resultUrl}
					className={
						`rounded-md cursor-pointer relative ` +
						`${
							websiteStarred
								? "glow"
								: "shadow-md/35 dark:shadow-none"
						}`
					}
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
				>
					{/* card badges */}
					{year && (
						<div className="absolute top-1 right-1 text-xs bg-blue-600 text-white p-1 px-2 rounded-md shadow-md/35">
							{year}
						</div>
					)}
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
								`dark:shadow-none bg-(--bg-layer-1)`
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
					{/* small extension on the bottom to ensure smooth hovering when image animates up and down */}
					<div className="absolute -bottom-[20px] h-[20px] w-full"></div>
				</motion.a>
				{/* title */}
				<a
					href={resultUrl}
					title={title}
					className={
						"text-lg font-semibold text-center line-clamp-2 h-18 pt-4 " +
						"md:h-11 md:line-clamp-1 " +
						`${isHovered ? "underline text-(--accent)" : ""}`
					}
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
				>
					{title}
				</a>
			</div>
		</>
	);
}
