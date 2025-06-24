import './allAnime.css';
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchStore } from "../../store/searchStore";
import { useDebounce } from "use-debounce";
import { useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";

// Типы данных
type FetchAnimeResponse = {
  pagination: {
    has_next_page: boolean;
    current_page: number;
  };
  data: Anime[];
};

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

// API функция для получения всех аниме
const fetchAllAnime = async ({ pageParam = 1 }): Promise<FetchAnimeResponse> => {
  const url = `https://api.jikan.moe/v4/anime?page=${pageParam}&limit=24`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

// Компонент карточки аниме
const AnimeCard = ({ item }: { item: Anime }) => {
  return (
    <Link 
      key={item.mal_id}
      to={`/anime/${item.mal_id}`}
      className="group relative overflow-hidden rounded-2xl bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-purple-500/50 block"
      style={{
        background: 'linear-gradient(145deg, rgba(39, 39, 42, 0.8), rgba(24, 24, 27, 0.9))',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
      }}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={item.images.jpg.large_image_url || item.images.jpg.image_url}
          alt={item.title}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:blur-sm group-hover:brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/95 via-zinc-900/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-cyan-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-80 flex flex-col p-6">
        {/* Rating Badge */}
        <div className="absolute top-4 right-4 bg-yellow-500/90 backdrop-blur-sm text-black px-2 py-1 rounded-full text-sm font-bold shadow-lg">
          ⭐ {item.score || 'N/A'}
        </div>

        {/* Genre Tags */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-1 max-w-[calc(100%-120px)]">
          {item.genres?.slice(0, 2).map((genre) => (
            <span
              key={genre.mal_id}
              className="text-xs px-2 py-1 bg-purple-600/80 backdrop-blur-sm text-white rounded-full font-medium shadow-sm"
            >
              {genre.name}
            </span>
          ))}
        </div>

        {/* Title and Description - Hidden by default, shown on hover */}
        <div className="mt-auto transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
          <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 drop-shadow-lg">
            {item.title_english || item.title}
          </h3>
          
          <p className="text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
            {item.synopsis 
              ? item.synopsis.slice(0, 120) + (item.synopsis.length > 120 ? '...' : '')
              : 'Описание недоступно'}
          </p>
        </div>
          
        {/* Favorite Button */}
        <div className="opacity-0 group-hover:opacity-100 absolute bottom-6 right-6 transition-all duration-500 z-20">
          <button 
            className="bg-zinc-700/80 backdrop-blur-sm hover:bg-zinc-600/80 text-white p-2.5 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
            </svg>
          </button>
        </div>

        {/* Watch indicator */}
        <div className="opacity-0 group-hover:opacity-100 absolute bottom-6 left-6 transition-all duration-500 z-20">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-1.5 px-3 rounded-lg text-sm font-semibold">
            👁️ Ko'rish
          </div>
        </div>

        {/* Default state - Only title visible */}
        <div className="group-hover:opacity-0 group-hover:translate-y-4 transition-all duration-500">
          <h3 className="text-lg font-bold text-white drop-shadow-lg line-clamp-2">
            {item.title_english || item.title}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-gray-400 text-sm">
              {item.year || 'N/A'} • {item.episodes || '?'} ep.
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const AllAnimePage = () => {
  const rawQuery = useSearchStore((state) => state.query);
  const [debouncedQuery] = useDebounce(rawQuery, 600);
  const observerRef = useRef<HTMLDivElement>(null);

  // Все аниме с бесконечной прокруткой
  const {
    data: allAnimeData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: allAnimeLoading,
    error: allAnimeError
  } = useInfiniteQuery<FetchAnimeResponse>({
    queryKey: ["allAnime"],
    queryFn: fetchAllAnime,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.has_next_page ? lastPage.pagination.current_page + 1 : undefined,
    enabled: !debouncedQuery,
    staleTime: 1000 * 60 * 10, // 10 минут кэш
  });

  // Объединяем все страницы в один массив
  const allAnime = allAnimeData?.pages.flatMap(page => page.data) || [];

  // Функция для обработки пересечения с наблюдателем
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [target] = entries;
    if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Настройка наблюдателя пересечений
  useEffect(() => {
    const element = observerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
      rootMargin: '100px',
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-zinc-800 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-cyan-600/10 animate-pulse"></div>
        <div className="relative px-4 sm:px-8 lg:px-16 py-12">
          
          <section className="mb-16">
            {/* Заголовок секции */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                📺 Barcha animelar
              </h1>
              <div className="hidden sm:block w-24 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"></div>
            </div>

            {/* Состояния загрузки и ошибок */}
            {allAnimeLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 w-16 h-16 border-4 border-pink-500/20 border-r-pink-500 rounded-full animate-spin animate-reverse"></div>
                </div>
              </div>
            ) : allAnimeError ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mb-4">
                  <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-red-400 text-lg font-medium">Ошибка загрузки: {allAnimeError.message}</p>
              </div>
            ) : (
              <>
                {/* Сетка аниме карточек */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                  {allAnime.map((item) => (
                    <AnimeCard key={`${item.mal_id}-${Math.random()}`} item={item} />
                  ))}
                </div>

                {/* Элемент-наблюдатель для бесконечной прокрутки */}
                <div ref={observerRef} className="flex justify-center items-center py-8">
                  {isFetchingNextPage && (
                    <div className="relative">
                      <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                      <div className="absolute inset-0 w-12 h-12 border-4 border-pink-500/20 border-r-pink-500 rounded-full animate-spin animate-reverse"></div>
                    </div>
                  )}
                  {!hasNextPage && allAnime.length > 0 && (
                    <p className="text-gray-400 text-center">
                      🎉 Вы посмотрели все доступные аниме!
                    </p>
                  )}
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default AllAnimePage;