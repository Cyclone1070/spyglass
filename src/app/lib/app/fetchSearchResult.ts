import axios from "axios";

export async function fetchSearchResult(query: string, api: string, cx: string) {
	const response = await axios.get("https://www.googleapis.com/customsearch/v1", {
		params: {
			cx: cx, 
			key: api,
			q: query,
		},
	});
	return response.data;
}
