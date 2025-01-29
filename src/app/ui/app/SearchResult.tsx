import { Result } from "@/app/types";
import Image from "next/image";
import sanitizeHtml from "sanitize-html";

interface Props {
	result: Result[] | null;
	className?: string;
}
export function SearchResult({ result, className }: Props) {
	return (
		<>
			{result ? (
				/* page container */
				<div className={`grid grid-cols-5 gap-3 ${className}`}>
					{/* item cards */}
					{result.map((item) => (
						<div key={item.link} className="flex flex-col shadow-md p-2 gap-2 rounded-md bg-[#decaab]">
							<div>{item.displayLink}</div>
							<div dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.htmlTitle) }}></div>
							<div dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.htmlSnippet) }}></div>
							<div dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.htmlFormattedUrl) }}></div>
						</div>
					))}
				</div>
			) : (
				<div className={`relative h-full w-[min(20rem,100%)] ${className}`}>
					<Image src="spyglass.svg" alt="a badass spyglass" fill />
				</div>
			)}
		</>
	);
}
