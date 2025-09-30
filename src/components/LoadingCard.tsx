import { twMerge } from "tailwind-merge";

interface Props {
	className?: string;
}

export function LoadingCard({ className = "" }: Props) {
	return (
		<div
			className={twMerge(
				`flex flex-col justify-end items-center animate-pulse`,
				className,
			)}
		>
			<div
				className={`w-48 h-48 bg-(--pulse) animate-pulse rounded-md shadow-md/35 dark:shadow-none`}
			></div>
			<div className={`bg-(--pulse) w-42 h-6 mt-4 rounded-md`}></div>
			<div className={`bg-(--pulse) w-42 h-6 mt-2 rounded-md`}></div>
		</div>
	);
}
