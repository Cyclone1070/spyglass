import { Result, SearchType } from "@/app/types";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import sanitizeHtml from "sanitize-html";
import Games from "/public/Games.svg";
import Star from "/public/Star.svg";

interface Props {
	result: Result;
	searchTypeList: SearchType[];
}

export function ResultCard({ result, searchTypeList }: Props) {
	const [isCardHovered, setIsCardHovered] = useState(false);
	const [isTextHovered, setIsTextHovered] = useState(false);
	const [isImageAvailable, setIsImageAvailable] = useState(
		result.pagemap.cse_image && result.pagemap.cse_image[0]?.src ? true : false
	);

	return (
		<a
			href={result.link}
			target="_blank"
			rel="noopener noreferrer"
			className="relative w-[15rem] h-[20rem] flex flex-col shadow-md p-2 gap-2 rounded-md bg-[--layer-1] overflow-hidden"
			onMouseEnter={() => {
				setIsCardHovered(true);
			}}
			onMouseLeave={() => {
				setIsCardHovered(false);
			}}
		>
			{/* link */}
			<div
				className={`text-[--link] ${
					isCardHovered && !isImageAvailable ? "underline" : ""
				} ${isCardHovered && isImageAvailable ? "opacity-0" : "opacity-100"} flex items-center gap-2 transition-all duration-300`}
			>
				<Star className="w-4 h-4 text-[--star] flex-shrink-0" />
				<span className="whitespace-normal break-all">{result.displayLink}</span>
			</div>
			{/* thumbnail */}
			<AnimatePresence>
				{isImageAvailable && isCardHovered ? (
					<motion.div
						key={result.link}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="absolute inset-0 z-10"
					>
						<Image
							src={result.pagemap.cse_image[0].src}
							alt={"result's thumbnail"}
							fill
							onError={() => {
								setIsImageAvailable(false);
							}}
						/>
					</motion.div>
				) : null}
			</AnimatePresence>
			<Games
				className={`absolute left-1/2 -translate-x-1/2 top-[10%] h-[50%] transition-opacity duration-300 ${isCardHovered && isImageAvailable ? "opacity-0" : "opacity-100"}`}
				style={{ color: searchTypeList.find((type) => type.name === "Games")?.color }}
			/>
			{/* result text wrapper */}
			<div
				onMouseEnter={() => {
					setIsTextHovered(true);
				}}
				onMouseLeave={() => {
					setIsTextHovered(false);
				}}
				className={`relative flex flex-col gap-4 mt-auto mx-1 mb-1 pr-[5px] rounded-md transition-all duration-200 z-10 ${
					isTextHovered ? "h-[70%] overflow-auto" : "h-[30%] overflow-hidden "
				} ${isCardHovered ? "bg-[--result-text-bg] shadow-[0_0_0.5rem_0.5rem_var(--result-text-bg)]" : ""}`}
				style={{ scrollbarWidth: "thin" }}
			>
				{/* result text content */}
				<div
					className={`relative z-10 ${isCardHovered ? "underline" : ""}`}
					dangerouslySetInnerHTML={{ __html: sanitizeHtml(result.htmlTitle) }}
				></div>
				<div
					className={`relative z-10 italic ${isCardHovered ? "" : "hidden"}`}
					dangerouslySetInnerHTML={{ __html: sanitizeHtml(result.htmlSnippet) }}
				></div>
			</div>
		</a>
	);
}
