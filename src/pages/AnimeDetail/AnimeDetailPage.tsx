import './animeDetailPage.css';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
// import { Star, Play, Heart, Bookmark, Share2, Users, Award, TrendingUp, ChevronRight, SkipBack, SkipForward } from 'lucide-react';
import { Star, Play, Heart, Users, ChevronRight, PlayIcon} from 'lucide-react';
// import VideoPlayer from '../../components/VideoPlayer/VideoPlayer';
import StatusDropdown from './animeStatus/AnimeStatus';

type AnimeDetails = {
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

type Episode = {
  mal_id: number;
  title: string;
  title_japanese?: string;
  title_romanji?: string;
  aired?: string;
  score?: number;
  filler?: boolean;
  recap?: boolean;
  forum_url?: string;
};

const AnimeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [anime, setAnime] = useState<AnimeDetails | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [episodesLoading, setEpisodesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState<number>(1);
  const parallaxRef = useRef<HTMLDivElement>(null);


  console.log(showVideoPlayer ? 'Video Player is shown' : 'Video Player is hidden');

  const formatNumber = (num: number | undefined) => {
    if (num === undefined) return 'N/A';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  // Проверка: фильм или 1 эпизод
  const isMovieOrSingleEpisode = () => {
    return anime && (anime.type === 'Movie' || anime.episodes === 1);
  };

  // close modal when clicked outside of modal trailer
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showTrailer && parallaxRef.current && !parallaxRef.current.contains(event.target as Node)) {
        setShowTrailer(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTrailer]);

  // const nextEpisode = () => {
  //   if (anime && currentEpisode < (anime.episodes || 0)) {
  //     setCurrentEpisode((prev) => prev + 1);
  //   }
  // };

  // const previousEpisode = () => {
  //   if (currentEpisode > 1) {
  //     setCurrentEpisode((prev) => prev - 1);
  //   }
  // };
  
  useEffect(() => {
    const fetchAnime = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
        if (!response.ok) throw new Error('Failed to fetch anime');
        const data = await response.json();
        setAnime(data.data);
        
        // Fetch episodes only if it's a TV series and has more than 1 episode
        if (data.data.type === 'TV' && data.data.episodes && data.data.episodes > 1) {
          fetchEpisodes(id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setAnime(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAnime();
    }
  }, [id]);

  const fetchEpisodes = async (animeId: string | undefined) => {
    if (!animeId) return;
    
    try {
      setEpisodesLoading(true);
      const response = await fetch(`https://api.jikan.moe/v4/anime/${animeId}/episodes`);
      if (response.ok) {
        const data = await response.json();
        setEpisodes(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch episodes:', err);
    } finally {
      setEpisodesLoading(false);
    }
  };

  const playEpisode = (episodeNumber: number) => {
    setCurrentEpisode(episodeNumber);
    setShowVideoPlayer(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-pink-500 rounded-full animate-spin animation-delay-150"></div>
        </div>
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-400">{error || 'Anime not found'}</p>
          <p className="text-gray-500 mt-2">ID: {id}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Parallax */}
      <div className="relative h-screen overflow-hidden">
        {/* Background Image with Parallax */}
        <div 
          ref={parallaxRef}
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${anime.images.jpg.large_image_url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(30px) brightness(0.3)',
          }}
        />

        {/* Main Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-6 lg:px-16">
            <div className="flex gap-12 items-center">
              {/* Left Content - Poster */}
              <div className="flex">
                <div className="relative group">
                  <div className="absolute -inset-4 rounded-3xl blur-2xl"></div>
                  <div className="relative overflow-hidden rounded-3xl cursor-pointer">
                    <img
                      src={anime.images.jpg.large_image_url}
                      alt={anime.title}
                      className="w-65 h-auto object-cover shadow-lg shadow-black transition-transform duration-300 transform group-hover:scale-105"
                    />
                    <div
                      className="absolute top-2 right-2 border-none rounded-full bg-transparent w-[90px] h-9 flex itmes-center justify-center gap-1">
                      <span className='p-1 rounded-full bg-(--danger-color) w-10 flex items-center justify-center'>
                        <svg
                          className="w-5 h-5 fill-current color-(--text-color)"
                          xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" /></svg>
                      </span>
                      <span className='p-1 rounded-full bg-(--green-color) flex items-center justify-center w-12'>
                        <svg
                          className="w-4 h-4 fill-current color-(--text-color)"
                          xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" /></svg>
                        {anime.score ? anime.score.toFixed(1) : 'N/A'}
                      </span>
                    </div>
                    {/* quality */}
                    <div
                      className='absolute bottom-1 right-1 bg-(--violet-color) text-(--text-color) rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1 h-9'
                    >
                      QHD+
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Content */}
                <div className="space-y-8">
                  {/* Адаптивные теги в одной строке */}
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    {/* age limit */}
                    {anime.rating && (
                      <span className="px-3 py-1.5 bg-(--grey-color) rounded-full text-sm sm:text-base font-semibold color-(--text-color) whitespace-nowrap">
                        14+
                      </span>
                    )}

                    {/* studio */}
                    {anime.studios && anime.studios.length > 0 && (
                      <span className="px-3 py-1.5 bg-(--grey-2-color) rounded-full text-sm sm:text-base font-semibold color-(--text-color) whitespace-nowrap">
                        {anime.studios[0].name}
                      </span>
                    )}

                    {/* status */}
                    {anime.status && (
                      <span className="px-3 py-1.5 bg-(--secondary-color) rounded-full text-sm sm:text-base font-semibold color-(--text-color) whitespace-nowrap">
                        {anime.status}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <div className="space-y-4">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight"
                      style={{
                        fontSize: 'clamp(28px, 4vw, 44px)',
                        fontWeight: '700',
                        fontStyle: 'normal',
                      }}
                    >
                      <span className="color-(--text-color)">
                        {anime.title_english || anime.title}
                      </span>
                    </h1>
                    {anime.title_japanese && (
                      <p className="text-lg sm:text-xl text-gray-400 font-light">
                        {anime.title_japanese}
                      </p>
                    )}
                  </div>

                  {/* genres */}
                  {anime.genres && anime.genres.length > 0 && (
                    <div>
                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        {anime.genres.map((genre) => (
                          <span
                            key={genre.mal_id}
                            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30 font-medium hover:bg-purple-500/30 transition-colors duration-300 cursor-pointer text-sm sm:text-base whitespace-nowrap"
                          >
                            {genre.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {/* release date */}
                  {anime.aired?.from && (
                    <p className="text-gray-500 text-sm sm:text-base mt-2">
                    Chiqdi: {new Date(anime.aired.from).toLocaleDateString(
                      'uz-UZ', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        }
                      )}
                    {anime.aired.to && ` dan - ${new Date(anime.aired.to).toLocaleDateString(
                      'uz-UZ', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                      )} gacha`}
                    </p>
                  )}

                  {/* Action Buttons */}
                <div className="flex items-center flex-wrap gap-3 sm:gap-4">
                    {/* Watch Now Button */}
                    <button
                      onClick={() => isMovieOrSingleEpisode() ? setShowVideoPlayer(true) : playEpisode(1)}
                      className="bg-(--grey-color) flex items-center gap-2 sm:gap-3 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-full font-bold transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer text-sm sm:text-base text-gray-300 hover:bg-(--primary-color) hover:text-white border border-gray-600/50 hover:border-(--primary-color) hover:shadow-(--primary-color) hover:shadow-lg"
                    >
                      <PlayIcon className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                      <span className="hidden sm:inline">
                        {isMovieOrSingleEpisode() ? `Ko'rish` : `1 seriya`}
                      </span>
                      <span className="sm:hidden">
                        {isMovieOrSingleEpisode() ? `Ko'rish` : '1 seriya'}
                      </span>
                  </button>
                  
                  {/* Status Dropdown */}
                  <StatusDropdown />

                  {/* treyler */}
                    {anime.trailer?.youtube_id && (
                      <button
                        onClick={() => setShowTrailer(!showTrailer)}
                        className="flex items-center gap-2 sm:gap-3 bg-(--grey-color) text-gray-300 border border-gray-600/50 hover:bg-gray-700/50 px-4 sm:px-6 py-3 sm:py-4 rounded-full font-bold transition-all duration-300 transform hover:scale-105 text-sm sm:text-base cursor-pointer hover:text-white hover:border-(--primary-color) hover:shadow-(--primary-color) hover:shadow-lg"
                      >
                        <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                        <span className="hidden sm:inline">Treyler</span>
                      </button>
                    )}
                
                  {/* Views */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <svg
                    className='w-4 h-4 sm:w-5 sm:h-5 fill-current text-gray-500'
                    xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle style={{ fill: '#bdc3c7' }} cx="12" cy="12" r="3" /></svg>
                  <span className="text-gray-500 text-sm sm:text-base">
                    {formatNumber(anime.popularity)}
                  </span>
                </div>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="relative z-10 bg-slate-900">
        {/* Episodes Section - Only show for TV series with multiple episodes */}
        {!isMovieOrSingleEpisode() && (
          <section className="py-20 px-6 lg:px-16 bg-gradient-to-r from-purple-900/10 to-pink-900/10">
            <div className="container mx-auto max-w-6xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Episodes ({anime.episodes})
                </h2>
                {episodesLoading && (
                  <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                )}
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {episodes.length > 0 ? (
                  episodes.map((episode, index) => (
                    <div
                      key={episode.mal_id}
                      onClick={() => playEpisode(index + 1)}
                      className="group bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 border border-slate-700 hover:border-purple-500/50 transition-all duration-300 cursor-pointer transform hover:scale-105"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white truncate group-hover:text-purple-400 transition-colors">
                            Episode {index + 1}
                          </h3>
                          {episode.score && (
                            <div className="flex items-center gap-1 text-yellow-400 text-sm">
                              <Star className="w-3 h-3 fill-current" />
                              {episode.score}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {episode.title && (
                        <p className="text-gray-400 text-sm line-clamp-2 mb-2">
                          {episode.title}
                        </p>
                      )}
                      
                      {episode.aired && (
                        <p className="text-gray-500 text-xs">
                          {new Date(episode.aired).toLocaleDateString()}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex gap-2">
                          {episode.filler && (
                            <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded">
                              Filler
                            </span>
                          )}
                          {episode.recap && (
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                              Recap
                            </span>
                          )}
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-purple-400 transition-colors" />
                      </div>
                    </div>
                  ))
                ) : (
                  // Fallback: Generate episode list based on episode count
                  Array.from({ length: anime.episodes || 0 }, (_, index) => (
                    <div
                      key={index}
                      onClick={() => playEpisode(index + 1)}
                      className="group bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 border border-slate-700 hover:border-purple-500/50 transition-all duration-300 cursor-pointer transform hover:scale-105"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors">
                            Episode {index + 1}
                          </h3>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-purple-400 transition-colors" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        )}

        {/* Synopsis Section */}
        <section className="py-20 px-6 lg:px-16">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Synopsis
            </h2>
            <div className="grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <p className="text-lg text-gray-300 leading-relaxed">
                  {anime.synopsis || 'No synopsis available.'}
                </p>
                {anime.background && (
                  <div className="mt-8 p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/20">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">Background</h3>
                    <p className="text-gray-300">{anime.background}</p>
                  </div>
                )}
              </div>
              
              {/* Info Panel */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700">
                  <h3 className="text-xl font-bold text-purple-400 mb-4">Information</h3>
                  <div className="space-y-4">
                    {anime.type && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Type</span>
                        <span className="font-semibold">{anime.type}</span>
                      </div>
                    )}
                    {anime.episodes && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Episodes</span>
                        <span className="font-semibold">{anime.episodes}</span>
                      </div>
                    )}
                    {anime.duration && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Duration</span>
                        <span className="font-semibold">{anime.duration}</span>
                      </div>
                    )}
                    {anime.status && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Status</span>
                        <span className="font-semibold">{anime.status}</span>
                      </div>
                    )}
                    {anime.season && anime.year && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Season</span>
                        <span className="font-semibold">{anime.season} {anime.year}</span>
                      </div>
                    )}
                    {anime.rating && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Rating</span>
                        <span className="font-semibold">{anime.rating}</span>
                      </div>
                    )}
                    {anime.source && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Source</span>
                        <span className="font-semibold">{anime.source}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats Panel */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700">
                  <h3 className="text-xl font-bold text-cyan-400 mb-4">Statistics</h3>
                  <div className="space-y-4">
                    {anime.members && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Members
                        </span>
                        <span className="font-semibold">{anime.members.toLocaleString()}</span>
                      </div>
                    )}
                    {anime.favorites && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 flex items-center gap-2">
                          <Heart className="w-4 h-4" />
                          Favorites
                        </span>
                        <span className="font-semibold">{anime.favorites.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Genres & Themes */}
        <section className="py-20 px-6 lg:px-16 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Genres */}
              

              {/* Themes */}
              {anime.themes && anime.themes.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold text-pink-400 mb-6">Themes</h3>
                  <div className="flex flex-wrap gap-3">
                    {anime.themes.map((theme) => (
                      <span
                        key={theme.mal_id}
                        className="px-4 py-2 bg-pink-500/20 text-pink-300 rounded-full border border-pink-500/30 font-medium hover:bg-pink-500/30 transition-colors duration-300 cursor-pointer"
                      >
                        {theme.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
      
      {/* Episode List Sidebar - Only for series */}
      {!isMovieOrSingleEpisode() && (
        <div className="w-80 bg-slate-900 border-l border-slate-700 overflow-y-auto">
          <div className="p-4 border-b border-slate-700">
            <h4 className="text-white font-bold">Episodes</h4>
            <p className="text-gray-400 text-sm">{anime.episodes} episodes</p>
          </div>
          
          <div className="p-2 space-y-2">
            {episodes.length > 0 ? (
              episodes.map((episode, index) => (
                <div
                  key={episode.mal_id}
                  onClick={() => setCurrentEpisode(index + 1)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    currentEpisode === index + 1
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded flex items-center justify-center text-sm font-bold ${
                      currentEpisode === index + 1
                        ? 'bg-white text-purple-600'
                        : 'bg-slate-600 text-gray-300'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        Episode {index + 1}
                      </p>
                      {episode.title && (
                        <p className="text-xs opacity-75 truncate">
                          {episode.title}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              Array.from({ length: anime.episodes || 0 }, (_, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentEpisode(index + 1)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    currentEpisode === index + 1
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded flex items-center justify-center text-sm font-bold ${
                      currentEpisode === index + 1
                        ? 'bg-white text-purple-600'
                        : 'bg-slate-600 text-gray-300'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Episode {index + 1}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      

      {/* Trailer Modal */}
      {showTrailer && anime.trailer?.youtube_id && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative bg-slate-900 rounded-2xl overflow-hidden max-w-4xl w-full">
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors duration-300"
            >
              ×
            </button>
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${anime.trailer.youtube_id}`}
                title="Anime Trailer"
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimeDetailPage;