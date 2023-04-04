export type FetchOptions = {
  method?: "GET";
  body?: Record<string, any> | FormData;
  headers?: Record<string, any>;
  params?: Record<string, any>;
};

const handleResponse = async (response: Response) => {
  const isJson = response.headers
    .get("content-type")
    ?.includes("application/json");
  const data = isJson ? await response.json() : null;
  return response.ok ? data : Promise.reject(data ?? response);
};

export const fetcher = <T = void>(
  path: string | URL,
  options: FetchOptions = { method: "GET" },
): Promise<T> => {
  const { body: rawBody, headers: rawHeaders, params, ...rest } = options;
  const body = rawBody instanceof FormData ? rawBody : JSON.stringify(rawBody);
  const headers = new Headers(rawHeaders);
  if (!(rawBody instanceof FormData)) {
    headers.append("Content-Type", "application/json");
  }

  const url = new URL(path, location.origin);
  url.search = new URLSearchParams({
    ...params,
  }).toString();

  return fetch(url, { ...rest, headers, body }).then(handleResponse);
};
