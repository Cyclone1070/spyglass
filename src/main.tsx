import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import { NavBar } from "./components/NavBar";
import { ThemeProvider } from "./context/ThemeProvider";
import Home from "./Home";
import "./index.css";

const router = createBrowserRouter([
	{
		path: "/",
		element: (
			<div className={`min-h-dvh w-screen bg-(--bg) flex flex-col`}>
				<NavBar />
				<Outlet />
			</div>
		),
		children: [{ index: true, Component: Home }],
	},
]);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ThemeProvider>
			<RouterProvider router={router} />
		</ThemeProvider>
	</StrictMode>,
);
