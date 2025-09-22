import { NavBar } from "./NavBar";

import { Outlet, useSearchParams } from "react-router";

export function AppLayout() {
	const [searchParams] = useSearchParams();
	const query = searchParams.get("q");

	return (
		<div className={`min-h-dvh w-screen bg-(--bg) flex flex-col`}>
			<NavBar />
			{/* 3. Apply the query as a key to the Outlet */}
			{/* When the URL is '/', query is null. When it's '/search?q=...', the key changes. */}
			<Outlet key={query} />
		</div>
	);
}
