import { URL, URLSearchParams } from "url";

export const fromString = (domainAndPath: string): URL =>
    new URL("https://" + domainAndPath);

export const fromStringWithQuery = (
    domainAndPath: string,
    query: Map<string, string>
): URL => {
    const url = new URL("https://" + domainAndPath);
    for (const [key, value] of query) {
        url.searchParams.append(key, value);
    }
    return url;
};

export const fromStringWithHash = (
    domainAndPath: string,
    hash: Map<string, string>
): URL => {
    const url = new URL("https://" + domainAndPath);
    url.hash = new URLSearchParams(hash).toString();
    return url;
};
