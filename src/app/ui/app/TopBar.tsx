import React, { useEffect } from "react";

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
	setTheme: React.Dispatch<React.SetStateAction<string>>;
	resolvedTheme: string | undefined;
}

export function TopBar({
	className,
	currentActiveButtonId,
	setCurrentActiveButtonId,
	setApi,
	api,
	setCx,
	cx,
	setTheme,
	resolvedTheme,
}: Props) {
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
				className="text-[--icon] p-2 rounded-lg"
				hoverOverlayTheme="fontColor"
				onClick={() => {
					setTheme((theme) => (theme === "dark" ? "light" : "dark"));
				}}
			>
				{!mounted ? (
					<div className="w-8 h-8 bg-gray-400 dark:bg-gray-700 rounded-lg animate-pulse" />
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
				buttonContent={<Setting className="relative w-8 h-8 text-[--icon]" />}
				hoverOverlayTheme="fontColor"
			>
				<DropDownContainer>
					<form
						action=""
						className="bg-[--layer-2] grid grid-rows-3 gap-7 p-7 rounded-lg shadow-[0_0.1rem_1rem_0_rgba(0,0,0,0.25)]"
						onSubmit={handleApiSubmit}
					>
						<div>
							<label htmlFor="cx">Engine ID: </label>
							<br />
							<input
								type="text"
								name="cx"
								id="cx"
								className="border focus:border-[--input-border-focus] focus:shadow-[0_0_1px_2px_var(--input-border-shadow)] border-[--input-border] bg-[--input-bg] outline-none py-1 px-2 rounded-md"
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
								className="border focus:border-[--input-border-focus] focus:shadow-[0_0_1px_2px_var(--input-border-shadow)] border-[--input-border] bg-[--input-bg] outline-none py-1 px-2 rounded-md"
								defaultValue={api ? api : ""}
							/>
						</div>
						<button className="text-[--on-dropdown] bg-[--icon] dark:text-[--background] dark:bg-[--foreground] py-1 px-4 self-center justify-self-end rounded-xl">
							Save
						</button>
					</form>
				</DropDownContainer>
			</DropDownButton>
		</div>
	);
}
