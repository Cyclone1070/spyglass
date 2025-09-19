import { useState } from "react";
import { mergeClasses } from "../utils/mergeClasses";

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
	className,
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
	return (
		<>
			<div
				className={mergeClasses(
					`flex flex-col items-center gap-4`,
					className,
				)}
			>
				{/* image container in order to align the title top on desktop, not clickable */}
				<div
					className={
						`flex items-end justify-center ` + `md:h-60 md:w-60`
					}
				>
					{/* image */}
					{imageUrl && !imageError ? (
						<a
							href={resultUrl}
							className={
								`shadow-md/35 cursor-pointer` +
								`dark:shadow-none`
							}
						>
							<img
								className={`max-w-60 max-h-60 rounded-md`}
								src={imageUrl}
								alt={altText || title}
								onError={() => setImageError(true)}
							/>
						</a>
					) : (
						<a
							href={resultUrl}
							className={
								`bg-(--bg-layer-1) w-48 h-48 rounded-md shadow-md/35 ` +
								`dark:shadow-none`
							}
						/>
					)}
				</div>
				{/* title */}
				<a
					href={resultUrl}
					className={`text-lg font-semibold text-center px-2 line-clamp-3 w-full`}
				>
					{title}
				</a>
			</div>
		</>
	);
}
