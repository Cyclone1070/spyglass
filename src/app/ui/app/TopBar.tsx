import React from "react";

import { DropDownButton } from "./DropDownButton";
import { DropDownContainer } from "./DropDownContainer";
import Setting from "/public/Setting.svg";

interface Props {
	className?: string;
	currentActiveButtonId: string | null;
	setCurrentActiveButtonId: React.Dispatch<React.SetStateAction<string | null>>;
	setApi: React.Dispatch<React.SetStateAction<string | null>>;
	setCx: React.Dispatch<React.SetStateAction<string | null>>;
}

export function TopBar({ className, currentActiveButtonId, setCurrentActiveButtonId, setApi, setCx }: Props) {
	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		localStorage.setItem("api", formData.get("api") as string);
		localStorage.setItem("cx", formData.get("cx") as string);
		setApi(formData.get("api") as string);
		setCx(formData.get("cx") as string);
	}

	return (
		<div className={`${className}`}>
			<DropDownButton
				currentActiveButtonId={currentActiveButtonId}
				setCurrentActiveButtonId={setCurrentActiveButtonId}
				className="p-2 rounded-lg"
				buttonContent={<Setting className="relative w-8 h-8" />}
				hoverOverlayTheme="lighter"
			>
				<DropDownContainer>
					<form
						action=""
						className="bg-[--layer-2] grid grid-rows-3 gap-7 p-7 rounded-lg shadow-lg"
						onSubmit={handleSubmit}
					>
						<div>
							<label htmlFor="cx">Engine ID: </label>
							<br />
							<input
								type="text"
								name="cx"
								id="cx"
								className="border focus:border-[--foreground] border-[--input-border] bg-[--input-bg] outline-none py-1 px-2 rounded-md"
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
