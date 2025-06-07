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

type FilterState = {
  genre: string;
  year: string;
  status: string;
  type: string;
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
      const { genre, year, status, type } = get().filter;

      // Если ничего не выбрано, покажем топ популярные аниме
      if (!genre && !year && !status && !type) {
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
      if (genre) queryParams.push(`genres=${genre}`);
      if (year) queryParams.push(`start_date=${year}`);
      if (status) queryParams.push(`status=${status}`);
      if (type) queryParams.push(`type=${type}`);

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
      genre: '', 
      year: '', 
      status: '',
      type: ''
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