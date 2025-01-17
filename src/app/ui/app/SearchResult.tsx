import { Result } from "@/app/type";
import React from "react";
import sanitizeHtml from "sanitize-html";

interface Props {
	result: Result[] | null;
}
export function SearchResult({ result }: Props) {
	return (
		<>
			{result ? (
				/* page container */
				<div className="grid grid-cols-5 gap-3">
					{/* item cards */}
					{result.map((item) => (
						<div key={item.link} className="flex flex-col shadow-md p-2 gap-2 rounded-md bg-[#decaab]">
							<div>{item.displayLink}</div>
							<div dangerouslySetInnerHTML={{__html: sanitizeHtml(item.htmlTitle)}}></div>
							<div dangerouslySetInnerHTML={{__html: sanitizeHtml(item.htmlSnippet)}}></div>
							<div dangerouslySetInnerHTML={{__html: sanitizeHtml(item.htmlFormattedUrl)}}></div>
						</div>
					))}
				</div>
			) : null}
		</>
	);
}
