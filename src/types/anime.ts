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

// export type FetchAnimeResponse = {
//   data: Anime[];
//     has_next_page: boolean;
//     current_page: number;
// };

export type AnimeSearchResult = {
  mal_id: number;
  title: string;
  title_english?: string;
  images: {
      jpg: {
          image_url: string;
      };
  };
  score?: number;
};

export type InfiniteAnimeData = {
  pages: FetchAnimeResponse[];
  pageParams: number[];
};

export type ContinueWatchingItem = {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
      large_image_url?: string;
    };
  };
  score?: number;
  watchedEpisodes: number;
  totalEpisodes: number;
  lastWatched: string;
};

export type FetchAnimeResponse = {
  pagination: {
    has_next_page: boolean;
    current_page: number;
  };
  data: Anime[];
};

export type FetchAnimeParams = {
  pageParam?: number;
};

export type AnimeDetails = {
  mal_id: number;
  title: string;
  title_english?: string;
  title_japanese?: string;
  type?: string;
  images: {
    jpg: {
      image_url: string;
      large_image_url: string;
    };
  };
  trailer?: {
    youtube_id?: string;
    url?: string;
  };
  score?: number;
  scored_by?: number;
  rank?: number;
  popularity?: number;
  members?: number;
  favorites?: number;
  synopsis?: string;
  background?: string;
  season?: string;
  year?: number;
  broadcast?: {
    day?: string;
    time?: string;
  };
  episodes?: number;
  duration?: string;
  rating?: string;
  source?: string;
  status?: string;
  aired?: {
    from?: string;
    to?: string;
  };
  studios?: Array<{
    name: string;
  }>;
  genres?: Array<{
    mal_id: number;
    name: string;
  }>;
  themes?: Array<{
    mal_id: number;
    name: string;
  }>;
  demographics?: Array<{
    mal_id: number;
    name: string;
  }>;
};

export type Episode = {
  mal_id: number;
  title: string;
  filler?: boolean;
  recap?: boolean;
  image_url?: string;
};