import SpyglassSvg from "../assets/spyglass.svg?react";
import { SearchBar } from "./SearchBar";

function Home() {
	return (
		<div
			className={
				`w-full grow flex flex-col items-center p-4 pt-20 gap-25 ` +
				`md:pt-30 md:gap-35`
			}
		>
			<SearchBar
				className={`w-full h-14`}
				placeholder="Search for title only for best results"
				autoFocus={true}
			/>
			<SpyglassSvg className={`max-w-100 mx-8`} />
			<a
				className={
					"absolute bottom-0 right-0 m-6 text-(--accent) hover:underline"
				}
				href="https://fmhy.net"
				target="_blank"
			>
				Visit the megathread
			</a>
		</div>
	);
}

export default Home;
