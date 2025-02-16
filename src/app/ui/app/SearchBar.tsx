import { SearchType } from "@/app/types";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import React from "react";
import { DropdownButton } from "./DropdownButton";
import { DropdownContainer } from "./DropdownContainer";
import DropdownArrow from "/public/DropdownArrow.svg";
import Search from "/public/Search.svg";

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
		<form
			className={`flex relative bg-[--layer-1] shadow-[0_0.1rem_0.5rem_0_rgba(60,64,67,0.25)] dark:shadow-none rounded-lg ${className}`}
			action="GET"
			onSubmit={handleSubmit}
		>
			{/* search mode selector */}
			<DropdownButton
				staticId="mode"
				className={`text-[--on-dropdown] font-bold rounded-l-lg w-[8rem] h-full ${
					currentSearchType === "All"
						? "bg-[--all]"
						: currentSearchType === "Games"
						? "bg-[--games]"
						: currentSearchType === "Movies"
						? "bg-[--movies]"
						: currentSearchType === "Books"
						? "bg-[--books]"
						: ""
				}`}
				buttonContent={
					<>
						<span>{currentSearchType}</span>
						<DropdownArrow
							className={`absolute w-4 h-4 right-[0.8rem] top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
								currentActiveButtonId === "mode" ? "rotate-180" : ""
							}`}
						/>
					</>
				}
				currentActiveButtonId={currentActiveButtonId}
				setCurrentActiveButtonId={setCurrentActiveButtonId}
				hoverOverlayTheme="bgColor"
			>
				<DropdownContainer className="rounded-lg overflow-hidden w-[8rem]">
					<>
						{searchTypeList.map((type) => (
							<button
								type="button"
								key={type}
								onClick={() => {
									setCurrentSearchType(type);
									setCurrentActiveButtonId(null);
								}}
								className={`flex relative justify-center items-center h-full w-full p-2 text-[--on-dropdown] font-bold shadow-lg ${
									type === "All"
										? "bg-[--all]"
										: type === "Games"
										? "bg-[--games]"
										: type === "Movies"
										? "bg-[--movies]"
										: type === "Books"
										? "bg-[--books]"
										: ""
								}`}
							>
								{/* darken background overlay */}
								<motion.div
									variants={{
										default: { opacity: 0 },
										hover: { opacity: 0.16 },
									}}
									initial="default"
									whileHover={"hover"}
									className="absolute z-30 top-0 left-0 w-full h-full rounded-[inherit] bg-[--bg-color-hover]"
								></motion.div>
								{type}
							</button>
						))}
					</>
				</DropdownContainer>
			</DropdownButton>

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
				{/* search divider */}
				<div className="absolute left-0 h-[70%] w-[1px] bg-[--icon]"></div>
				<Search className="relative h-[70%] w-6 text-[--icon]" />
			</button>
		</form>
	);

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		if (api && cx) {
			e.preventDefault();
			const formData = new FormData(e.currentTarget);
			const query = formData.get("search")?.toString().trim();
			const queryType = currentSearchType.toLowerCase();
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
