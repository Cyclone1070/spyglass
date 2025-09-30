import { motion } from "motion/react";
import { useState } from "react";

import { twMerge } from "tailwind-merge";
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
	query: string | null;
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
	const [imageLoaded, setImageLoaded] = useState(false);
	const [isCardHovered, setIsCardHovered] = useState(false);
	const [isBadgeHovered, setIsBadgeHovered] = useState(false);
	const formattedSearchUrl = query
		? searchUrl.replace("{0}", encodeURIComponent(query))
		: null;
	return (
		<>
			<div
				className={twMerge(
					`flex flex-col justify-end items-center`,
					className,
				)}
			>
				<motion.div
					animate={isCardHovered ? { scale: 1.05 } : { scale: 1 }}
					className={`rounded-md cursor-pointer relative shadow-md/35`}
					onMouseLeave={() => setIsCardHovered(false)}
					onMouseEnter={() => setIsCardHovered(true)}
					onTouchStart={() => setIsCardHovered(true)}
					onTouchEnd={() => setIsCardHovered(false)}
				>
					{/* image */}
					<a target="_blank" href={resultUrl}>
						{/* card badges */}
						{/* image */}
						{imageUrl && !imageError ? (
							<>
								<img
									className={
										"max-w-60 max-h-60 rounded-md bg-(--bg-layer-1)" +
										(imageLoaded ? "" : "hidden")
									}
									src={imageUrl}
									alt={altText || title}
									onError={() => setImageError(true)}
									onLoad={(e) => {
										const { naturalWidth, naturalHeight } =
											e.currentTarget;

										if (
											naturalWidth < 100 &&
											naturalHeight < 100
										) {
											// If the image is too small, treat it as an error
											setImageError(true);
											return;
										}
										setImageLoaded(true);
									}}
								/>
								<div
									className={
										"w-48 h-48 rounded-md bg-(--pulse) animate-pulse " +
										(imageLoaded ? "hidden" : "")
									}
								/>
							</>
						) : (
							<div
								className={
									`w-48 h-48 rounded-md flex justify-center items-center ` +
									`bg-(--bg-layer-1)`
								}
							>
								{category === "Books" && (
									<BookSvg className="w-20 h-20 text-blue-600" />
								)}
								{(category === "Movies" ||
									category === "Anime") && (
									<MovieSvg className="w-20 h-20 text-blue-600" />
								)}
								{category === "Games Repack" && (
									<RepackSvg className="w-20 h-20 text-blue-600" />
								)}
								{(category === "Games Download" ||
									category === "Abandonware/ROM") && (
									<GameSvg className="w-20 h-20 text-blue-600" />
								)}
								{category === "Windows Software" && (
									<WindowsSvg className="w-20 h-20 text-blue-600" />
								)}
								{category === "Mac" && (
									<MacSvg className="w-20 h-20 text-blue-600" />
								)}
								{category === "iOS" && (
									<IosSvg className="w-20 h-20 text-blue-600" />
								)}
								{category === "Android" && (
									<AndroidSvg className="w-20 h-20 text-blue-600" />
								)}
							</div>
						)}
					</a>
					{/* badge */}
					<a
						target="_blank"
						href={formattedSearchUrl || ""}
						onClick={(e) => {
							e.stopPropagation();
							if (!query) {
								e.preventDefault();
							}
						}}
						className={
							"absolute bottom-2 right-0 mx-2 text-xs text-white bg-blue-600 p-1 px-2 rounded-md shadow-md/35 " +
							(isBadgeHovered ? "underline" : "")
						}
						onMouseEnter={() => setIsBadgeHovered(true)}
						onMouseLeave={() => setIsBadgeHovered(false)}
						onTouchStart={(e) => {
							e.stopPropagation();
							setIsBadgeHovered(true);
						}}
						onTouchEnd={(e) => {
							e.stopPropagation();
							setIsBadgeHovered(false);
						}}
					>
						{websiteTitle}
					</a>
					{websiteStarred && (
						<StarSvg
							className={
								"text-yellow-400 absolute top-2 right-0 mx-2 w-6 h-6 " +
								(imageUrl && !imageError
									? "glow"
									: "glow-yellow")
							}
						/>
					)}
				</motion.div>
				{/* title */}
				<div className={`w-full overflow-hidden flex justify-center`}>
					<a
						target="_blank"
						href={resultUrl}
						title={title}
						className={
							"font-semibold text-center line-clamp-2 h-16 pt-4 " +
							`${isCardHovered && !isBadgeHovered ? "underline text-(--accent)" : ""}`
						}
						onMouseEnter={() => setIsCardHovered(true)}
						onMouseLeave={() => setIsCardHovered(false)}
						onTouchStart={() => setIsCardHovered(true)}
						onTouchEnd={() => setIsCardHovered(false)}
					>
						{title}
					</a>
				</div>
			</div>
		</>
	);
}
