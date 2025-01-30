"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchSearchResult } from "./lib/app/fetchSearchResult";
import { Result, SearchType } from "./types";
import { ButtonWithOverlay } from "./ui/app/ButtonWithOverlay";
import { SearchBar } from "./ui/app/SearchBar";
import { SearchResult } from "./ui/app/SearchResult";
import { TopBar } from "./ui/app/TopBar";
import Home from "/public/Home.svg";

export default function App() {
	const [api, setApi] = useState<string | null>(null);
	const [cx, setCx] = useState<string | null>(null);
	const [result, setResult] = useState<Result[] | null>(null);
	const [searchTypeList, setSearchTypeList] = useState<SearchType[]>([
		{ name: "All", color: "#e8e8e8" },
		{ name: "Games", color: "#FFAC27" },
		{ name: "Videos", color: "#FF2528" },
		{ name: "Books", color: "#00BFFF" },
	]);
	const [currentSearchType, setCurrentSearchType] = useState<SearchType>(searchTypeList[0]);
	const [currentActiveButtonId, setCurrentActiveButtonId] = useState<string | null>(null);
	const searchParams = useSearchParams();
	const queryType = searchParams.get("type");
	const query = searchParams.get("q");
	const router = useRouter();

	useEffect(() => {
		if (query && queryType && api && cx) {
			fetchSearchResult(query, api, cx)
				.then((data) => {
					console.log(query);
					console.log(queryType);
					console.log(data);
					setResult(data.items);
				})
				.catch((error) => {
					console.log(error);
				});
		}
	}, [query, api, cx, queryType]);

	useEffect(() => {
		if (!query) {
			setResult(null);
		}
	}, [query]);

	useEffect(() => {
		const api = localStorage.getItem("api");
		const cx = localStorage.getItem("cx");
		if (api) setApi(api);
		if (cx) setCx(cx);
	}, []);

	return (
		<div className="grid grid-cols-[1fr_5fr_1fr] grid-rows-[4rem_20vh_1fr] items-center gap-4 p-3 h-screen">
			{/* home icon */}
			<div className="px-4 justify-self-start">
				<ButtonWithOverlay
					onClick={() => {
						router.push("/");
					}}
					className="p-2 rounded-lg"
					hoverOverlayTheme="lighter"
				>
					<Home className="relative w-8 h-8"/>
				</ButtonWithOverlay>
			</div>
			<TopBar
				setApi={setApi}
				setCx={setCx}
				className="col-start-3 justify-self-end px-4"
				currentActiveButtonId={currentActiveButtonId}
				setCurrentActiveButtonId={setCurrentActiveButtonId}
			/>
			<SearchBar
				currentSearchType={currentSearchType}
				setCurrentSearchType={setCurrentSearchType}
				currentActiveButtonId={currentActiveButtonId}
				setCurrentActiveButtonId={setCurrentActiveButtonId}
				searchTypeList={searchTypeList}
				api={api}
				cx={cx}
				className={result ? "col-start-2 row-start-1" : "col-start-2 self-end"}
				query={query}
			/>
			<SearchResult
				result={result}
				className={result ? "row-start-2 row-span-2 col-span-3" : "row-start-3 col-start-2 justify-self-center"}
			/>
		</div>
	);
}
