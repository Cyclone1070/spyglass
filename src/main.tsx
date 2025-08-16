import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import Home from "./components/Home";
import { NavBar } from "./components/NavBar";
import { SearchResult } from "./components/SearchResult";
import { ThemeProvider } from "./context/ThemeProvider";
import "./index.css";

const router = createBrowserRouter([
	{
		path: "/",
		element: (
			<div
				className={`min-h-dvh w-screen bg-(--bg) flex flex-col sticky`}
			>
				<NavBar />
				<Outlet />
			</div>
		),
		children: [
			{ index: true, Component: Home },
			{ path: "search", Component: SearchResult },
		],
	},
]);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ThemeProvider>
			<RouterProvider router={router} />
		</ThemeProvider>
	</StrictMode>,
);
