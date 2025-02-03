import React, { useEffect } from "react";

import { useTheme } from "next-themes";
import { ButtonWithOverlay } from "./ButtonWithOverlay";
import { DropDownButton } from "./DropDownButton";
import { DropDownContainer } from "./DropDownContainer";
import DarkMode from "/public/DarkMode.svg";
import LightMode from "/public/LightMode.svg";
import Setting from "/public/Setting.svg";

interface Props {
	className?: string;
	currentActiveButtonId: string | null;
	setCurrentActiveButtonId: React.Dispatch<React.SetStateAction<string | null>>;
	setApi: React.Dispatch<React.SetStateAction<string | null>>;
	api: string | null;
	setCx: React.Dispatch<React.SetStateAction<string | null>>;
	cx: string | null;
}

export function TopBar({ className, currentActiveButtonId, setCurrentActiveButtonId, setApi, api, setCx, cx }: Props) {
	const { setTheme, resolvedTheme } = useTheme();
	const [mounted, setMounted] = React.useState(false);

	useEffect(() => {
		setMounted(true);
	}, [setMounted]);

	function handleApiSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		localStorage.setItem("api", formData.get("api") as string);
		localStorage.setItem("cx", formData.get("cx") as string);
		setApi(formData.get("api") as string);
		setCx(formData.get("cx") as string);
	}

	return (
		<div className={`${className}`}>
			<ButtonWithOverlay
				className="text-[--foreground] p-2 rounded-lg"
				hoverOverlayTheme="fontColor"
				onClick={() => {
					setTheme((theme) => (theme === "dark" ? "light" : "dark"));
				}}
			>
				{!mounted ? (
					<div className="w-8 h-8 bg-gray-400 dark:bg-gray-700 rounded-lg animate-pulse" style={{animationDuration: "1s"}} />
				) : resolvedTheme === "dark" ? (
					<DarkMode className="w-8 h-8" />
				) : (
					<LightMode className="w-8 h-8" />
				)}
			</ButtonWithOverlay>
			<DropDownButton
				currentActiveButtonId={currentActiveButtonId}
				setCurrentActiveButtonId={setCurrentActiveButtonId}
				className="p-2 rounded-lg"
				buttonContent={<Setting className="relative w-8 h-8" />}
				hoverOverlayTheme="fontColor"
			>
				<DropDownContainer>
					<form
						action=""
						className="bg-[--layer-2] grid grid-rows-3 gap-7 p-7 rounded-lg shadow-lg"
						onSubmit={handleApiSubmit}
					>
						<div>
							<label htmlFor="cx">Engine ID: </label>
							<br />
							<input
								type="text"
								name="cx"
								id="cx"
								className="border focus:border-[--foreground] border-[--input-border] bg-[--input-bg] outline-none py-1 px-2 rounded-md"
								defaultValue={cx ? cx : ""}
							/>
						</div>
						<div>
							<label htmlFor="api">API: </label>
							<br />
							<input
								type="text"
								name="api"
								id="api"
								className="border focus:border-[--foreground] border-[--input-border] bg-[--input-bg] outline-none py-1 px-2 rounded-md"
								defaultValue={api ? api : ""}
							/>
						</div>
						<button className="text-[--background] bg-[--foreground] py-1 px-4 self-center justify-self-end rounded-xl">
							Save
						</button>
					</form>
				</DropDownContainer>
			</DropDownButton>
		</div>
	);
}
