import React, { useEffect } from "react";

export function SearchBar() {
	useEffect(() => {
		const script = document.createElement("script");
		script.src = "https://cse.google.com/cse.js?cx=c321272d7a06c4961";
		script.async = true;
		document.body.appendChild(script);
	}, []);

	return <div className="gcse-search"></div>;
}
