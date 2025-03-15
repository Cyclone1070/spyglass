"use client";
import { useTheme } from "next-themes";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchSearchResult } from "./lib/app/fetchSearchResult";
import { Result, SearchType } from "./types";
import { ButtonWithOverlay } from "./ui/app/ButtonWithOverlay";
import { PageNumbers } from "./ui/app/PageNumbers";
import { SearchBar } from "./ui/app/SearchBar";
import { SearchResults } from "./ui/app/SearchResults";
import { TopBar } from "./ui/app/TopBar";
import Home from "/public/Home.svg";

export default function App() {
	const { setTheme, resolvedTheme } = useTheme();
	const [api, setApi] = useState(() => {
		if (typeof window !== "undefined") {
			return localStorage.getItem("api") || "AIzaSyCPtZpZO_C55Sxpi0InxiFDOVomIN6ZS8I";
		}
		return null;
	});
	const [cx, setCx] = useState(() => {
		if (typeof window !== "undefined") {
				return localStorage.getItem("cx") || "c321272d7a06c4961";
		}
		return null;
	});
	const [resultList, setResultList] = useState<Result[] | null>(null);
	const [prevPage, setPrevPage] = useState(false);
	const [nextPage, setNextPage] = useState(false);
	const searchTypeList: SearchType[] = ["All", "Games", "Movies", "Books"];
	const [currentSearchType, setCurrentSearchType] = useState<SearchType>("All");
	const [currentActiveButtonId, setCurrentActiveButtonId] = useState<string | null>(null);
	/* get search param query */
	const searchParams = useSearchParams();
	const queryType = searchParams.get("type") || "all";

	const query = searchParams.get("q");
	const startIndex = Number(searchParams.get("start"));
	const router = useRouter();

	useEffect(() => {
		if (query && queryType && api && cx && startIndex) {
			fetchSearchResult(query, api, cx, startIndex)
				.then((data) => {
					console.log(query);
					console.log(queryType);
					console.log(data);
					setResultList(data.items);
					setPrevPage(data.queries.previousPage ? true : false);
					setNextPage(data.queries.nextPage ? true : false);
				})
				.catch((error) => {
					console.error(error);
				});
		}
	}, [query, api, cx, queryType, startIndex]);

	useEffect(() => {
		if (!query) {
			setResultList(null);
		}
	}, [query]);

	/* changing icon colors based on currentSearchType */
	useEffect(() => {
		if (resolvedTheme === "light") {
			switch (currentSearchType) {
				case "All":
					document.documentElement.style.setProperty("--icon", "var(--all)");
					break;
				case "Games":
					document.documentElement.style.setProperty("--icon", "var(--games)");
					break;
				case "Movies":
					document.documentElement.style.setProperty("--icon", "var(--movies)");
					break;
				case "Books":
					document.documentElement.style.setProperty("--icon", "var(--books)");
					break;
			}
		} else {
			document.documentElement.style.removeProperty("--icon");
		}
	});

	return (
		<div className="grid grid-cols-[1fr_5fr_1fr] grid-rows-[4rem_20vh_auto_4rem] items-center gap-4 p-3 h-screen">
			{/* home icon */}
			<div className="px-4 justify-self-start">
				<ButtonWithOverlay
					onClick={() => {
						router.push("/");
					}}
					className="p-2 rounded-lg"
					hoverOverlayTheme="fontColor"
				>
					<Home className="relative w-8 h-8 text-[--icon]" />
				</ButtonWithOverlay>
			</div>
			<TopBar
				setTheme={setTheme}
				resolvedTheme={resolvedTheme}
				setApi={setApi}
				api={api}
				setCx={setCx}
				cx={cx}
				className="col-start-3 justify-self-end flex gap-2 px-4"
				currentActiveButtonId={currentActiveButtonId}
				setCurrentActiveButtonId={setCurrentActiveButtonId}
			/>
			<SearchBar
				searchTypeList={searchTypeList}
				currentSearchType={currentSearchType}
				setCurrentSearchType={setCurrentSearchType}
				currentActiveButtonId={currentActiveButtonId}
				setCurrentActiveButtonId={setCurrentActiveButtonId}
				api={api}
				cx={cx}
				className={resultList ? "col-start-2 row-start-1" : "col-start-2 self-end"}
				query={query}
			/>
			<SearchResults
				resultList={resultList}
				className={
					resultList
						? "row-start-2 row-span-2 col-span-3 self-start"
						: "row-start-3 col-start-2 justify-self-center"
				}
			/>
			{resultList ? (
				<PageNumbers
					prevPage={prevPage}
					nextPage={nextPage}
					searchParams={searchParams}
					className="col-span-3"
				></PageNumbers>
			) : null}
		</div>
	);
}
