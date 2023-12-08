/**
 * Constructs a URL by combining the base URL with the provided query params.
 * Query params in the base URL will be overwritten by the provided params on conflict.
 *
 * @param {string} url - The URL, including any query params.
 * @param {Record<string, string>} queryParams:  - The query params to merge in.
 * @returns {string} The constructed URL with the settings as query parameters.
 */
export function mergeQuery(
  url: string,
  queryParams: Record<string, string>,
): string {
  const [baseUrl, existingQueryString] = url.split("?");

  const existingParams = Object.fromEntries(
    new URLSearchParams(existingQueryString ?? "").entries(),
  );
  const combinedParams = new URLSearchParams({
    ...existingParams,
    ...queryParams,
  });
  const combinedQueryString = combinedParams.toString();

  return `${baseUrl}?${combinedQueryString}`;
}
