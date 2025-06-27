import { create } from "zustand";
import { debounce } from "lodash";

type Anime = {
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

export type FilterState = {
  genres: string[];
  yearFrom: string;
  yearTo: string;
  status: string;
  type: string;
  minScore?: number;
  maxScore?: number;
  isMovieOnly?: boolean;
};

type SearchState = {
  query: string;
  filter: FilterState;
  results: Anime[];
  isLoading: boolean;
  error: string | null;
  setQuery: (q: string) => void;
  setFilter: (filter: Partial<FilterState>) => void;
  clearResults: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
};

export const useSearchStore = create<SearchState>((set, get) => {
  const fetchByQuery = async (q: string) => {
    if (!q.trim()) {
      set({ results: [], isLoading: false });
      return;
    }

    set({ isLoading: true, error: null });
    
    try {
      const url = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(q)}&limit=20&order_by=popularity&sort=asc`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      set({ 
        results: data.data ?? [], 
        isLoading: false,
        error: null 
      });
    } catch (error) {
      console.error("Ошибка при поиске по запросу:", error);
      set({ 
        results: [], 
        isLoading: false,
        error: error instanceof Error ? error.message : 'Произошла ошибка при поиске'
      });
    }
  };

  const fetchByFilter = async () => {
    set({ isLoading: true, error: null });
    
    try {
      const { genres, yearFrom, yearTo, status, type, minScore, maxScore, isMovieOnly } = get().filter;

      // Если ничего не выбрано, покажем топ популярные аниме
      if ((!genres || genres.length === 0) && !yearFrom && !yearTo && !status && !type && !minScore && !maxScore && !isMovieOnly) {
        const url = `https://api.jikan.moe/v4/anime?order_by=popularity&sort=asc&limit=20&min_score=7`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        set({ 
          results: data.data ?? [], 
          isLoading: false,
          error: null 
        });
        return;
      }

      const queryParams = [];
      if (genres && genres.length > 0) queryParams.push(`genres=${genres.join(',')}`);
      if (yearFrom) queryParams.push(`start_date=${yearFrom.length === 4 ? yearFrom + '-01-01' : yearFrom}`);
      if (yearTo) queryParams.push(`end_date=${yearTo.length === 4 ? yearTo + '-12-31' : yearTo}`);
      if (status) queryParams.push(`status=${status}`);
      if (type) queryParams.push(`type=${type}`);
      if (isMovieOnly) queryParams.push('type=movie');
      if (minScore !== undefined) queryParams.push(`min_score=${minScore}`);
      if (maxScore !== undefined) queryParams.push(`max_score=${maxScore}`);

      queryParams.push('limit=20');
      queryParams.push('order_by=popularity');
      queryParams.push('sort=asc');

      const queryStr = queryParams.join("&");
      const url = `https://api.jikan.moe/v4/anime?${queryStr}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      set({ 
        results: data.data ?? [], 
        isLoading: false,
        error: null 
      });
    } catch (error) {
      console.error("Ошибка при фильтрации:", error);
      set({ 
        results: [], 
        isLoading: false,
        error: error instanceof Error ? error.message : 'Произошла ошибка при фильтрации'
      });
    }
  };

  const debouncedFetch = debounce((q: string) => {
    if (q.trim()) {
      fetchByQuery(q);
    } else {
      fetchByFilter();
    }
  }, 500);

  return {
    query: '',
    filter: { 
      genres: [], 
      yearFrom: '', 
      yearTo: '', 
      status: '',
      type: '',
      minScore: undefined,
      maxScore: undefined,
      isMovieOnly: false,
    },
    results: [],
    isLoading: false,
    error: null,
    
    setQuery: (q) => {
      set({ query: q });
      debouncedFetch(q);
    },
    
    setFilter: (filter) => {
      set((state) => ({
        filter: { ...state.filter, ...filter },
      }));
      
      // Если нет активного поискового запроса, применяем фильтры
      if (!get().query.trim()) {
        fetchByFilter();
      }
    },
    
    clearResults: () => {
      set({ 
        results: [], 
        query: '', 
        error: null,
        isLoading: false 
      });
    },
    
    setLoading: (loading) => {
      set({ isLoading: loading });
    },
    
    setError: (error) => {
      set({ error });
    }
  };
});