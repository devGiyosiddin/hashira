import type { FetchAnimeResponse } from "../../types/anime";


export const fetchAnime = async (query: string, limit = 12) => {
    const url = `https://api.jikan.moe/v4/anime?q=${query}&limit=${limit}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.data;
};


export const fetchTopAnime = async () => {
  const url = `https://api.jikan.moe/v4/anime?order_by=score&sort=desc&limit=10&min_score=8`;
  const response = await fetch(url);
  const data = await response.json();
  return data.data;
};

export const fetchNewReleases = async () => {
  const url = `https://api.jikan.moe/v4/anime?order_by=start_date&sort=desc&limit=10&status=airing`;
  const response = await fetch(url);
  const data = await response.json();
  return data.data;
};

export const fetchAllAnime = async ({ pageParam = 1 }: { pageParam?: number }): Promise<FetchAnimeResponse> => {
  const url = `https://api.jikan.moe/v4/anime?page=${pageParam}&limit=24`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
};