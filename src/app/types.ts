export interface SearchType {
	name: string;
	color: string;
}
// Reference: https://developers.google.com/custom-search/v1/reference/rest/v1/Search
export interface Search {
	kind: string;
	url: {
		type: string;
		template: string;
	};
	queries: {
		previousPage: Query[];
		request: Query[];
		nextPage: Query[];
	};
	promotions: Promotion[];
	context: {
		title: string;
	};
	searchInformation: {
		searchTime: number;
		formattedSearchTime: string;
		totalResults: string;
		formattedTotalResults: string;
	};
	spelling: {
		correctedQuery: string;
		htmlCorrectedQuery: string;
	};
	items: Result[];
}

export interface Query {
	title: string;
	totalResults: string;
	searchTerms: string;
	count: number;
	startIndex: number;
	startPage: number;
	language: string;
	inputEncoding: string;
	outputEncoding: string;
	safe: string;
	cx: string;
	sort: string;
	filter: string;
	gl: string;
	cr: string;
	googleHost: string;
	disableCnTwTranslation: string;
	hq: string;
	hl: string;
	siteSearch: string;
	siteSearchFilter: string;
	exactTerms: string;
	excludeTerms: string;
	linkSite: string;
	orTerms: string;
	relatedSite: string;
	dateRestrict: string;
	lowRange: string;
	highRange: string;
	fileType: string;
	rights: string;
	searchType: string;
	imgSize: string;
	imgType: string;
	imgColorType: string;
	imgDominantColor: string;
}
export interface Promotion {
	title: string;
	htmlTitle: string;
	link: string;
	displayLink: string;
	bodyLines: [
		{
			title: string;
			htmlTitle: string;
			url: string;
			link: string;
		}
	];
	image: {
		source: string;
		width: number;
		height: number;
	};
}
export interface Result {
	kind: string;
	title: string;
	htmlTitle: string;
	link: string;
	displayLink: string;
	snippet: string;
	htmlSnippet: string;
	cacheId: string;
	formattedUrl: string;
	htmlFormattedUrl: string;
	pagemap: {
		cse_thumbnail: [
			{
				src: string;
				width: string;
				height: string;
			}
		];
		metatags: [
			{
				"og:image": string;
				"og:type": string;
				"twitter:card": string;
				"twitter:title": string;
				"og:site_name": string;
				"twitter:url": string;
				"og:title": string;
				"og:description": string;
				"twitter:description": string;
				"og:url": string;
			}
		];
		cse_image: [
			{
				src: string;
			}
		];
	};
	mime: string;
	fileFormat: string;
}
