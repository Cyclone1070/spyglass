import { SearchType } from "@/app/types";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import React from "react";
import { DropDownButton } from "./DropDownButton";
import { DropDownContainer } from "./DropDownContainer";
import DropDownArrow from "/public/DropDownArrow.svg";
import Search from "/public/search.svg";

interface Props {
	api: string | null;
	cx: string | null;
	className?: string;
	searchTypeList: SearchType[];
	currentSearchType: SearchType;
	setCurrentSearchType: React.Dispatch<React.SetStateAction<SearchType>>;
	currentActiveButtonId: string | null;
	setCurrentActiveButtonId: React.Dispatch<React.SetStateAction<string | null>>;
	query: string | null;
}

export function SearchBar({
	api,
	cx,
	className,
	searchTypeList,
	currentSearchType,
	setCurrentSearchType,
	currentActiveButtonId,
	setCurrentActiveButtonId,
	query,
}: Props) {
	const router = useRouter();
	return (
		<form className={`flex relative bg-[--layer-1] rounded-lg ${className}`} action="GET" onSubmit={handleSubmit}>
			{/* search mode selector */}
			<DropDownButton
				staticId="mode"
				className={`text-[--background] font-bold rounded-l-lg w-[8rem] h-full`}
				buttonBgColor={currentSearchType.color}
				buttonContent={
					<>
						<span>{currentSearchType.name}</span>
						<DropDownArrow
							className={`absolute w-4 h-4 right-[0.8rem] top-1/2 transform -translate-y-1/2 transition-all duration-300 text-[#121212] ${
								currentActiveButtonId === "mode" ? "rotate-180" : ""
							}`}
						/>
					</>
				}
				currentActiveButtonId={currentActiveButtonId}
				setCurrentActiveButtonId={setCurrentActiveButtonId}
				hoverOverlayTheme="darker"
			>
				<DropDownContainer className="rounded-lg overflow-hidden w-[8rem]">
					<>
						{searchTypeList.map((type) => (
							<button
								type="button"
								key={type.name}
								style={{ backgroundColor: `${type.color}` }}
								onClick={() => {
									setCurrentSearchType(type);
									setCurrentActiveButtonId(null);
								}}
								className="flex relative justify-center items-center h-full w-full p-2 text-[--background] font-bold shadow-lg"
							>
								{/* darken background overlay */}
								<motion.div
									variants={{
										default: { backgroundColor: "#00000000" },
										hover: { backgroundColor: "#00000029" },
									}}
									initial="default"
									whileHover={"hover"}
									className="absolute z-30 top-0 left-0 w-full h-full rounded-[inherit]"
								></motion.div>
								{type.name}
							</button>
						))}
					</>
				</DropDownContainer>
			</DropDownButton>

			{/* input field */}
			<input
				id="search"
				name="search"
				className={`outline-none px-5 py-2 w-full rounded-lg bg-[--layer-1]`}
				placeholder="Enter your search phrase"
				type="text"
				defaultValue={query ? query : ""}
			/>

			{/* search button */}
			<button className="flex items-center justify-center relative w-[8rem]">
				<div className="absolute left-0 h-[70%] w-[1px] bg-[--foreground]"></div>
				<Search className="relative h-[70%] w-6" />
			</button>
		</form>
	);

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		if (api && cx) {
			e.preventDefault();
			const formData = new FormData(e.currentTarget);
			const query = formData.get("search")?.toString().trim();
			const queryType = currentSearchType.name.toLowerCase();
			const searchParams = new URLSearchParams();

			if (query && queryType) {
				searchParams.set("q", query);
				searchParams.set("type", queryType);
				searchParams.set("start", "1");
				router.push(`?${searchParams.toString()}`);
			}
		} else {
			alert("Please enter API and Search Engine ID first");
		}
	}
}
