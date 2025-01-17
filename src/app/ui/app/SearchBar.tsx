import React from "react";
import { fetchSearchResult } from "@/app/lib/app/fetchSearchResult";
import { Result } from "@/app/type";

interface Props {
	api: string | null;
	cx: string | null;
	setResult: React.Dispatch<React.SetStateAction<Result[] | null>>;
	className?: string;
}

export function SearchBar({ api, cx, setResult, className }: Props) {
	return (
		<form className="" action="GET" onSubmit={handleSubmit}>
			<input
				id="search"
				name="search"
				className={`outline-none p-2 rounded-md border ${className}`}
				placeholder="Enter your search phrase"
				type="text"
			/>
		</form>
	);

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		if (api && cx) {
			e.preventDefault();
			const formData = new FormData(e.currentTarget);
			const query = formData.get("search") as string;
			fetchSearchResult(query, api, cx).then((data) => {
				console.log(data);
				setResult(data.items);
			});
		} else {
			alert("Please enter API and Search Engine ID first");
		}
	}
}
