import React from "react";
import { ThemeContext } from "./useTheme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [isDarkMode, setDarkMode] = React.useState<boolean>(
		// Check local storage for theme preference or use system preference
		localStorage.isDarkMode === "true" ||
			(!("isDarkMode" in localStorage) &&
				window.matchMedia("(prefers-color-scheme: dark)").matches),
	);

	document.documentElement.classList.toggle("dark", isDarkMode);

	const toggleTheme = () => {
		setDarkMode((prevTheme) => {
			// Save the new theme preference to local storage
			localStorage.setItem("isDarkMode", JSON.stringify(!prevTheme));
			// Toggle the class on the document element
			document.documentElement.classList.toggle("dark", !prevTheme);

			return !prevTheme;
		});
	};

	return (
		<ThemeContext.Provider value={{ isDarkMode: isDarkMode, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}
