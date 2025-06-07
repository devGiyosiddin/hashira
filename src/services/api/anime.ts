export const fetchAnime = async (query: string, limit = 12) => {
    const url = `https://api.jikan.moe/v4/anime?q=${query}&limit=${limit}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.data;
};