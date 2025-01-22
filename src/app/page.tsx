"use client";
import { useEffect, useState } from "react";
import { SearchBar } from "./ui/app/SearchBar";
import { Result, SearchType } from "./type";
import { SearchResult } from "./ui/app/SearchResult";
import { TopBar } from "./ui/app/TopBar";

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

	useEffect(() => {
		const api = localStorage.getItem("api");
		const cx = localStorage.getItem("cx");
		if (api) setApi(api);
		if (cx) setCx(cx);
	}, []);

	return (
		<div className="grid grid-cols-[1fr_5fr_1fr] grid-rows-[4rem_20vh_1fr] items-center gap-4 p-3 h-screen">
			<TopBar setApi={setApi} setCx={setCx} className="col-start-3 justify-self-end px-4" currentActiveButtonId={currentActiveButtonId} setCurrentActiveButtonId={setCurrentActiveButtonId} />
			<SearchBar
				currentSearchType={currentSearchType}
				setCurrentSearchType={setCurrentSearchType}
				currentActiveButtonId={currentActiveButtonId}
				setCurrentActiveButtonId={setCurrentActiveButtonId}
				searchTypeList={searchTypeList}
				api={api}
				cx={cx}
				setResult={setResult}
				className={result ? "col-start-2 row-start-1" : "col-start-2 self-end"}
			/>
			<SearchResult result={result} className={result ? "row-start-2 row-span-2 col-span-3" : "row-start-3 col-start-2 justify-self-center"} />
		</div>
	);
}
