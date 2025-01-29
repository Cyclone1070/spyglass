import { SearchType } from "@/app/types";
import { motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { DropDownButton } from "./DropDownButton";
import { DropDownContainer } from "./DropDownContainer";

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
						<div
							className={`absolute w-4 h-4 right-[0.8rem] top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
								currentActiveButtonId === "mode" ? "rotate-180" : ""
							}`}
						>
							<Image src="drop-down-arrow.svg" alt="drop-down-icon" fill />
						</div>
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
			<button className="flex items-center relative w-[8rem]">
				<div className="absolute h-[70%] w-[1px] bg-[--foreground]"></div>
				<div className="relative h-[70%] w-full">
					<Image src="search.svg" alt="search-icon" fill />
				</div>
			</button>
		</form>
	);

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		if (api && cx) {
			e.preventDefault();
			const formData = new FormData(e.currentTarget);
			const query = formData.get("search")?.toString().trim();
			const queryType = currentSearchType.name.toLowerCase();
			const params = new URLSearchParams();

			if (query && queryType) {
				params.set("q", query);
				params.set("type", queryType);
				router.push(`?${params.toString()}`);
			}
		} else {
			alert("Please enter API and Search Engine ID first");
		}
	}
}
