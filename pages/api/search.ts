import { NextApiRequest, NextApiResponse } from "next";

import { isNil, omitBy } from "lodash-es";

import { parseToNumber, parseToString } from "../../utils/query-params";
import rateLimit from "../../utils/rateLimit";

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per second
});

function parseSearchParams(query: Partial<Record<string, string | string[]>>) {
  const q = parseToString(query.q);
  const offset = parseToNumber(query.offset)?.toString();

  return omitBy({ q: q && encodeURIComponent(q), offset }, isNil) as Record<
    string,
    string
  >;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const search = new URLSearchParams(parseSearchParams(req.query));

  try {
    await limiter.check(res, 10, "CACHE_TOKEN"); // 10 requests per minute

    const response = await fetch(
      `https://api.bing.microsoft.com/v7.0/search?${search}`,
      {
        headers: { "Ocp-Apim-Subscription-Key": process.env.BING_API_KEY! },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch search results: ${response.statusText}`);
    }

    const data = await response.json();
    res.status(200).json(data.webPages?.value ?? []);
  } catch (error) {
    console.error(error);
    if (error === 429) {
      return res
        .status(429)
        .json({ message: "Rate limit exceeded", code: 429 });
    }

    res.status(500).json({ message: "Internal Server Error", code: 500 });
  }
};

export default handler;
