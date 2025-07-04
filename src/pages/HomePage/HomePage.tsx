import './homePage.css';
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useSearchStore } from "../../store/searchStore";
import { useDebounce } from "use-debounce";
import { HeroBanner } from '../../components';
import Sidebar from "../../components/SideBar/SideBar";
import { continueWatchingData } from "../../data/MockData";
import type { ContinueWatchingItem } from "../../types/anime";
import type { Anime } from "../../types/anime";

// API fuktsiyalar
const fetchTopAnime = async () => {
  const url = `https://api.jikan.moe/v4/anime?order_by=score&sort=desc&limit=10&min_score=8`;
  const response = await fetch(url);
  const data = await response.json();
  return data.data;
};

const fetchNewReleases = async () => {
  const url = `https://api.jikan.moe/v4/anime?order_by=start_date&sort=desc&limit=10&status=airing`;
  const response = await fetch(url);
  const data = await response.json();
  return data.data;
};

// Continue watching card component
const ContinueWatchingCard = ({ item }: { item: ContinueWatchingItem }) => {
  const progressPercentage = (item.watchedEpisodes / item.totalEpisodes) * 100;
  
  return (
    <Link
      key={item.mal_id}
      to={`/anime/${item.mal_id}`}
      className="group relative overflow-hidden rounded-2xl backdrop-blur-sm border-none shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-purple-500/50 block
                 h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80"
      style={{
        background: 'linear-gradient(145deg, rgba(39, 39, 42, 0.8), rgba(24, 24, 27, 0.9))',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
      }}
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src={item.images.jpg.large_image_url || item.images.jpg.image_url}
          alt={item.title}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:blur-sm group-hover:brightness-75"
        />
        
        {/* Top right badges */}
        <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
          <span className="p-1 rounded-full bg-blue-500/80 backdrop-blur-sm w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 fill-current text-white"
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z"/>
            </svg>
          </span>
          
          <span className="p-1 rounded-full bg-green-500/80 backdrop-blur-sm h-8 sm:h-9 px-2 sm:px-3 flex items-center justify-center gap-1">
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4 fill-current text-white"
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24"
            >
              <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
            </svg>
            <span className="text-xs sm:text-sm font-medium text-white">
              {item.score ? item.score.toFixed(1) : 'N/A'}
            </span>
          </span>
        </div>

        {/* Last watched indicator */}
        <div className="absolute bottom-2 right-2 bg-orange-600/90 backdrop-blur-sm text-white rounded-full px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm font-semibold flex items-center gap-1 h-7 sm:h-8 z-10">
          {item.lastWatched}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 z-[1]"></div>
        
        {/* Hover Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-cyan-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[2]"></div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="bg-black/50 backdrop-blur-sm h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-300"
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Title and episode info overlay */}
      <div className="absolute bottom-2 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/90 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
        <h3 className="text-white text-base sm:text-lg md:text-xl font-bold line-clamp-1 mb-2">
          {item.title}
        </h3>
        <div className="flex items-center justify-between text-sm text-gray-300">
          <span>{item.watchedEpisodes}/{item.totalEpisodes} episodes</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
      </div>
    </Link>
  );
};

// Anime kartochka komponenti
const AnimeCard = ({ item }: { item: Anime }) => {
  return (
    <Link
      key={item.mal_id}
      to={`/anime/${item.mal_id}`}
      className="group relative overflow-hidden rounded-2xl backdrop-blur-sm border-none shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-purple-500/50 block
                 h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80"
      style={{
        background: 'linear-gradient(145deg, rgba(39, 39, 42, 0.8), rgba(24, 24, 27, 0.9))',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
      }}
    >
      {/* Fon rasmi */}
      <div className="absolute inset-0 z-0">
        <img
          src={item.images.jpg.large_image_url || item.images.jpg.image_url}
          alt={item.title}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:blur-sm group-hover:brightness-75"
        />
        
        {/* Tepa-o'ng ikonkalar */}
        <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
          <span className="p-1 rounded-full bg-red-500/80 backdrop-blur-sm w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 fill-current text-white"
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
            </svg>
          </span>
          
          <span className="p-1 rounded-full bg-green-500/80 backdrop-blur-sm h-8 sm:h-9 px-2 sm:px-3 flex items-center justify-center gap-1">
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4 fill-current text-white"
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
            </svg>
            <span className="text-xs sm:text-sm font-medium text-white">
              {item.score ? item.score.toFixed(1) : 'N/A'}
            </span>
          </span>
        </div>

        {/* Video sifati ko'rsatilgan QHD+ mini icon */}
        <div className="absolute bottom-2 right-2 bg-purple-600/90 backdrop-blur-sm text-white rounded-full px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm font-semibold flex items-center gap-1 h-7 sm:h-8 z-10">
          QHD+
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 z-[1]"></div>
        
        {/* Hover Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-cyan-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[2]"></div>
      </div>

      {/* Title overlay - faqat hover qilinganda ko'rsatilsin */}
      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/90 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
      <h3 className="text-white text-base sm:text-lg md:text-xl font-bold line-clamp-2">
          {item.title}
        </h3>
        {item.synopsis && (
          <p className="text-gray-300 text-sm sm:text-base mt-2 line-clamp-3 mb-10">
            {item.synopsis.length > 120 ? `${item.synopsis.slice(0, 120)}...` : item.synopsis}
          </p>
        )}
      </div>
    </Link>
  );
};

// Bo'limlar komponenti
const AnimeSection = ({ title, data, isLoading, error, icon }: {
  title: string;
  data: Anime[];
  isLoading: boolean;
  error: Error | null;
  icon: string;
}) => (
  <section className="mb-16">
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-3xl sm:text-4xl font-bold">
        {icon} {title}
      </h2>
    </div>

    {isLoading ? (
      <div className="flex justify-center items-center py-20">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-pink-500/20 border-r-pink-500 rounded-full animate-spin animate-reverse"></div>
        </div>
      </div>
    ) : error ? (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mb-4">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-red-400 text-lg font-medium">Ошибка загрузки: {error.message}</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {data?.map((item) => (
          <AnimeCard key={item.mal_id} item={item} />
        ))}
      </div>
    )}
  </section>
);

const HomePage = () => {
  const rawQuery = useSearchStore((state) => state.query);
  const [debouncedQuery] = useDebounce(rawQuery, 600);

  // Top anime
  const { data: topAnime, isLoading: topLoading, error: topError } = useQuery({
    queryKey: ["topAnime"],
    queryFn: fetchTopAnime,
    enabled: !debouncedQuery,
    staleTime: 1000 * 60 * 30, // 30 daqiqa kesh
  });

  // Yangi relizlar
  const { data: newReleases, isLoading: newLoading, error: newError } = useQuery({
    queryKey: ["newReleases"],
    queryFn: fetchNewReleases,
    enabled: !debouncedQuery,
    staleTime: 1000 * 60 * 15, // 15 минут кэш
  });
  console.log("Top Anime:", topAnime);

  return (
    <main className="min-h-screen gap-6"
      style={{
        "display": "flex",
      }}
    >
      {/* Hero Banner Section */}
      <Sidebar />
      <div className="flex-1 max-w-[2000px]">
        <HeroBanner />
        {/* <HeroBanner anime={topAnime?.[0] || {}}/> */}
        {/* Ko'rishni davom etish */}
        <div className="my-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold">
              ⏳ Ko'rishni davom etish
            </h2>
            <Link 
              to="/continue-watching" 
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200"
            >
              Hammasini ko'rish →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {continueWatchingData.map((item) => (
              <ContinueWatchingCard key={item.mal_id} item={item} />
            ))}
          </div>
        </div>

        {!debouncedQuery.trim() && (
          <>
            {/* Топ аниме */}
            <AnimeSection
              title="Top anime"
              data={topAnime}
              isLoading={topLoading}
              error={topError}
              icon="🏆"
            />

            {/* Новые релизы */}
            <AnimeSection
              title="Yangi relizlar"
              data={newReleases}
              isLoading={newLoading}
              error={newError}
              icon="🆕"
            />

            {/* TODO: Virus daraada top animelar bo'limi */}

            {/* Userlar tomonidan baxolangan animelar
            Anime kartochka komponenti
              baxo yulduzli ikonkalar bilan
              va koment
              p - Foydalanuvchi tomonidan baxolangan animelar
              - Foydalanuvchi tomonidan baxolangan animelar bo'limi

            <AnimeSection
              title="Userlar tomonidan baxolangan animelar"
              data={topAnime} // Placeholder, real data needed
              isLoading={false} // Placeholder, real loading state needed
              error={null} // Placeholder, real error state needed
              icon="⭐"
            />
            */}

            {/* Barcha animelarni ko'rish tugmasi" */}
            <div className="text-center mt-12">
              <Link 
                to="/all"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <span className="mr-2">📺</span>
                Посмотреть все аниме
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default HomePage;