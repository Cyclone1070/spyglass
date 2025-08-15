import { mergeClasses } from "../utils/mergeClasses";

interface Props {
	className?: string;
	imgSrc?: string;
}

export function ResultCard({ className, imgSrc }: Props) {
	return (
		<div
			className={mergeClasses(
				`flex flex-col items-center gap-2 group cursor-pointer`,
				className,
			)}
		>
			{/* the card itself */}
			<div
				className={
					`bg-(--bg-layer-1) w-40 h-60 rounded-md shadow-lg ` +
					`dark:shadow-none`
				}
			>
				{imgSrc ? <img src={imgSrc} alt="an image" /> : null}
			</div>
			{/* the title of the card */}
			<a
				href="test"
				className={`text-lg font-semibold group-hover:underline`}
			>
				Title of the Result
			</a>
		</div>
	);
}
