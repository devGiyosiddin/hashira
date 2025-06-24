export type Anime = {
  mal_id: number;
  title: string;
  title_english?: string;
  images: {
    jpg: {
      image_url: string;
      large_image_url?: string;
    };
  };
  score?: number;
  synopsis?: string;
  genres?: Array<{
    mal_id: number;
    name: string;
  }>;
  year?: number;
  episodes?: number;
};

export type FetchAnimeResponse = {
  data: Anime[];
    has_next_page: boolean;
    current_page: number;
};

export type InfiniteAnimeData = {
  pages: FetchAnimeResponse[];
  pageParams: number[];
};