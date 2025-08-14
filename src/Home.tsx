import { SearchBar } from "./components/SearchBar";
import SpyglassSvg from "./assets/spyglass.svg?react";

function Home() {
	return (
		<div
			className={`w-full grow flex flex-col items-center p-4 pt-30 gap-30`}
		>
			<SearchBar className={`w-full`} />
			<SpyglassSvg className={`text-(--text) max-w-100`} />
		</div>
	);
}

export default Home;
