import { useRouter } from "next/navigation";

interface Props {
	className?: string;
	searchParams: URLSearchParams;
}

export function PageNumbers({ className, searchParams }: Props) {
	const router = useRouter();
	const currentPageNumber = Number(searchParams.get("start"));

	function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
		const newSearchParams = new URLSearchParams(searchParams);
		newSearchParams.set("start", e.currentTarget.textContent as string);
		router.push(`?${newSearchParams.toString()}`);
	}
	function handleNextClick() {
		const newSearchParams = new URLSearchParams(searchParams);
		newSearchParams.set("start", String(currentPageNumber + 1));
		router.push(`?${newSearchParams.toString()}`);
	}
	function handlePrevClick() {
		const newSearchParams = new URLSearchParams(searchParams);
		newSearchParams.set("start", String(currentPageNumber - 1));
		router.push(`?${newSearchParams.toString()}`);
	}

	return (
		<div className={`flex justify-center gap-2 ${className}`}>
			<button onClick={handleNextClick} className="text-[--link] hover:underline mr-10">
				&lt; Previous
			</button>
			<button
				onClick={handleClick}
				className={`hover:underline ${
					currentPageNumber === 1 ? "font-bold text-[--foreground]" : "text-[--link]"
				}`}
			>
				{currentPageNumber < 7 ? 1 : currentPageNumber - 5}
			</button>
			<button
				onClick={handleClick}
				className={`hover:underline ${
					currentPageNumber === 2 ? "font-bold text-[--foreground]" : "text-[--link]"
				}`}
			>
				{currentPageNumber < 7 ? 2 : currentPageNumber - 4}
			</button>
			<button
				onClick={handleClick}
				className={`hover:underline ${
					currentPageNumber === 3 ? "font-bold text-[--foreground]" : "text-[--link]"
				}`}
			>
				{currentPageNumber < 7 ? 3 : currentPageNumber - 3}
			</button>
			<button
				onClick={handleClick}
				className={`hover:underline ${
					currentPageNumber === 4 ? "font-bold text-[--foreground]" : "text-[--link]"
				}`}
			>
				{currentPageNumber < 7 ? 4 : currentPageNumber - 2}
			</button>
			<button
				onClick={handleClick}
				className={`hover:underline ${
					currentPageNumber === 5 ? "font-bold text-[--foreground]" : "text-[--link]"
				}`}
			>
				{currentPageNumber < 7 ? 5 : currentPageNumber - 1}
			</button>
			<button
				onClick={handleClick}
				className={`hover:underline ${
					currentPageNumber >= 6 ? "font-bold text-[--foreground]" : "text-[--link]"
				}`}
			>
				{currentPageNumber < 7 ? 6 : currentPageNumber}
			</button>
			<button onClick={handleClick} className="text-[--link] hover:underline">
				{currentPageNumber < 7 ? 7 : currentPageNumber + 1}
			</button>
			<button onClick={handleClick} className="text-[--link] hover:underline">
				{currentPageNumber < 7 ? 8 : currentPageNumber + 2}
			</button>
			<button onClick={handleClick} className="text-[--link] hover:underline">
				{currentPageNumber < 7 ? 9 : currentPageNumber + 3}
			</button>
			<button onClick={handleClick} className="text-[--link] hover:underline">
				{currentPageNumber < 7 ? 10 : currentPageNumber + 4}
			</button>
			<button onClick={handlePrevClick} className="text-[--link] hover:underline ml-10">
				Next &gt;
			</button>
		</div>
	);
}
