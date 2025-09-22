import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { AppLayout } from "./components/AppLayout";
import Home from "./components/Home";
import { SearchResult } from "./components/SearchResult";
import { ThemeProvider } from "./context/ThemeProvider";
import "./index.css";

const router = createBrowserRouter([
	{
		path: "/",
		element: <AppLayout />,
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
