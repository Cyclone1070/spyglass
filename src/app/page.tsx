"use client";
import { useEffect, useState } from "react";
import { SearchBar } from "./ui/app/SearchBar";
import { Result } from "./type";
import { SearchResult } from "./ui/app/SearchResult";

export default function App() {
	const [api, setApi] = useState<string | null>(null);
	const [cx, setCx] = useState<string | null>(null);
	const [result, setResult] = useState<Result[] | null>(null);

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		localStorage.setItem("api", formData.get("api") as string);
		localStorage.setItem("cx", formData.get("cx") as string);
		setApi(formData.get("api") as string);
		setCx(formData.get("cx") as string);
	}
	useEffect(() => {
		const api = localStorage.getItem("api");
		const cx = localStorage.getItem("cx");
		if (api) setApi(api);
		if (cx) setCx(cx);
	}, []);
	return (
		<div className="flex flex-col items-center gap-4 p-3">
			{(!api || !cx) && (
				<form action="" className="grid grid-cols-[1fr_2fr] grid-rows-2 gap-2" onSubmit={handleSubmit}>
					<label htmlFor="api">API: </label>
					<input type="text" name="api" id="api" className="border"/>
					<label htmlFor="cx">Engine ID: </label>
					<input type="text" name="cx" id="cx" className="border" />
					<button className="col-start-2 border border-black">Connect</button>
				</form>
			)}
			<SearchBar api={api} cx={cx} setResult={setResult} className="mt-[28vh] w-[70vw]" />
			<SearchResult result={result} />
		</div>
	);
}
