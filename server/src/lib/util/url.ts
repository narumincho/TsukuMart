import { URL } from "url";

/**
 * URLの文字列を作成する
 * @param domainAndPath ドメインとパス console.firebase.google.com/project/tsukumart など https://はつけない https://は自動でつく
 * @param query クエリ
 */
export const fromString = (
    domainAndPath: string,
    query: Map<string, string>
): URL => {
    const url = new URL("https://" + domainAndPath);
    for (const [key, value] of query) {
        url.searchParams.append(key, value);
    }
    return url;
};
