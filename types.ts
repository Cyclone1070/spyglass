export interface GenericResult {
    title: string;
    resultUrl: string;
    websiteTitle: string;
    websiteUrl: string;
    websiteStarred: boolean;
    score: number;
    year?: string;
    type: string;
    imageUrl?: string;
}
export interface BookResult extends GenericResult {
    format?: string;
    author?: string;
    language?: string;
}
export interface MovieResult extends GenericResult {
    director?: string;
}
export interface GameResult extends GenericResult {
    platform?: string;
    size?: string;
}
export type Result = BookResult | MovieResult | GameResult;
