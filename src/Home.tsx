import { SearchBar } from "./components/SearchBar";
import SpyglassSvg from "./assets/spyglass.svg?react";

function Home() {
	return (
		<div
			className={
				`w-full grow flex flex-col items-center p-4 pt-15 gap-30 ` +
				`md:pt-30 md:gap-30`
			}
		>
			<SearchBar
				className={`w-full h-14`}
				placeholder="Enter your search"
			/>
			<SpyglassSvg className={`max-w-100`} />
		</div>
	);
}

export default Home;
