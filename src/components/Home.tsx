import { useState } from "react";
import SpyglassSvg from "../assets/spyglass.svg?react";
import { SearchBar } from "./SearchBar";

function Home() {
	const [currentCategory, setCurentCategory] = useState("All");
	return (
		<div
			className={
				`w-full grow flex flex-col items-center p-4 pt-20 gap-25 ` +
				`md:pt-30 md:gap-35`
			}
		>
			<SearchBar
				className={`w-full h-14`}
				placeholder="Enter your search"
			/>
			<SpyglassSvg className={`max-w-100 mx-8`} />
		</div>
	);
}

export default Home;
