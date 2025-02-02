import axios from "axios";

export async function fetchSearchResult(query: string, api: string, cx: string, startIndex: number) {
	const response = await axios.get("https://www.googleapis.com/customsearch/v1", {
		params: {
			cx: cx, 
			key: api,
			q: query,
			start: startIndex
		},
	});
	return response.data;
}
