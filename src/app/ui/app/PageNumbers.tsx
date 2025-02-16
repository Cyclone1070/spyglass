import { useRouter } from "next/navigation";

interface Props {
	className?: string;
	searchParams: URLSearchParams;
	prevPage: boolean;
	nextPage: boolean;
}

export function PageNumbers({ className, searchParams, prevPage, nextPage }: Props) {
	const currentStartIndex = Number(searchParams.get("start"));
	const router = useRouter();

	function handleNextClick() {
		const newSearchParams = new URLSearchParams(searchParams);
		newSearchParams.set("start", String(currentStartIndex + 10));
		router.push(`?${newSearchParams.toString()}`);
	}
	function handlePrevClick() {
		const newSearchParams = new URLSearchParams(searchParams);
		newSearchParams.set("start", String(currentStartIndex - 10));
		router.push(`?${newSearchParams.toString()}`);
	}

	return (
		<div className={`grid grid-cols-2 gap-2 ${className}`}>
			{prevPage ? (
				<button onClick={handlePrevClick} className="text-[--link] hover:underline mr-10 text-right">
					&lt; Previous
				</button>
			) : (
				<div></div>
			)}
			{nextPage ? (
				<button onClick={handleNextClick} className="text-[--link] hover:underline ml-10 text-left">
					Next &gt;
				</button>
			) : (
				<div></div>
			)}
		</div>
	);
}
