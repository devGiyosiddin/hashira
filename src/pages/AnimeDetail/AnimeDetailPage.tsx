import './animeDetailPage.css';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Play, PlayIcon } from 'lucide-react';
import StatusDropdown from './animeStatus/AnimeStatus';
import EpisodesSection from '../../components/EpisodesSection/EpisodesSection';
import type { AnimeDetails, Episode } from '../../types/anime';

const SynopsisSection = ({ anime }: { anime: AnimeDetails }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const synopsis = anime.synopsis || 'No synopsis available.';
  const shortSynopsis = synopsis.length > 200 ? synopsis.slice(0, 200) + '...' : synopsis;
  const shouldShowButton = synopsis.length > 200;

  return (
    <section className="py-20 pl-[64px] pr-0 px-6 w-full lg:w-[35%]">
      <div className="max-w-2xl">
        <h2 className="text-4xl font-bold mb-8">
          Anime haqida
        </h2>
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="lg:col-span-2">
            <div className="relative rounded-b-lg">
              <p className="text-lg text-gray-300 leading-relaxed">
                {isExpanded ? synopsis : shortSynopsis}
              </p>
              
              {shouldShowButton && (
              <button
                  onClick={(e) => {
                    setIsExpanded(!isExpanded)
                    e.currentTarget.style.display = 'none';
                  }}  
                className={`-translate-y-full bottom-0 w-full h-20 ml-5 mt-4 py-4 font-medium transition-all duration-200 flex items-center cursor-pointer justify-center gap-2 hover:scale-105 text-sm ${
                  !isExpanded 
                    ? 'bg-[linear-gradient(180deg,#0000,#111)]' 
                    : ''
                }`}
              >
                {isExpanded ? 'Yashirish' : `To'liq ko'rsatish`}
              </button>
            )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
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
  const [episodeSearch, setEpisodeSearch] = useState('');
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
  
  useEffect(() => {
    const fetchAnime = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
        if (!response.ok) throw new Error('Failed to fetch anime');
        const data = await response.json();
        setAnime(data.data);
        console.log('DEBUG ANIME:', data.data);
        
        // Fetch episodes for all except Movie and only if episodes > 1
        if (data.data.type !== 'Movie' && data.data.episodes && data.data.episodes > 1) {
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

  const playEpisode = () => {
    setShowVideoPlayer(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
      <div className="relative"
        style={{
          // boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          boxShadow: 'rgb(19, 17, 17) 0px 0px 80px 40px inset',
        }}
      >
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
          <div className="flex gap-12 items-center pb-16 px-6 lg:px-16">
            {/* Left Content - Poster */}
            <div className="flex">
              <div className="relative group">
                <div className="relative overflow-hidden rounded-3xl cursor-pointer"
                  style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.7)' }} >
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
                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" /></svg>
                    </span>
                    <span className='p-1 rounded-full bg-(--green-color) flex items-center justify-center w-12'>
                      <svg
                        className="w-4 h-4 fill-current color-(--text-color)"
                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" /></svg>
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
              <div className="space-y-4">
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
                <div className="space-y-0">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight my-2"
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
                  {/* Watch Button */}
                <button
                  onClick={() => isMovieOrSingleEpisode() ? setShowVideoPlayer(true) : playEpisode()}
                  className="bg-white flex items-center gap-2 sm:gap-3 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 font-bold transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer text-sm sm:text-base text-black rounded-full "
                  style={{
                    borderTopLeftRadius: '6px',
                    borderEndEndRadius: '6px',
                  }}
                >
                  <PlayIcon className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                  <span className="hidden sm:inline">
                    {isMovieOrSingleEpisode() ? `Ko'rish` : `1 seriya`}
                  </span>
                  <span className="sm:hidden">
                    {isMovieOrSingleEpisode() ? `Ko'rish` : '1 seriya'}
                  </span>
                </button>

                {/* Notify Button */}
                <button
                  onClick={() => alert('Bu funksiya hali qo\'shilmagan')}
                  className="bg-[var(--grey-color)] text-gray-300 border border-gray-600/50 hover:bg-gray-700/50 px-4 sm:px-6 py-3 sm:py-4 font-bold transition-all duration-300 transform hover:scale-105 text-sm sm:text-base cursor-pointer hover:text-white hover:border-[var(--primary-color)] hover:shadow-[var(--primary-color)] hover:shadow-lg rounded-full"
                  style={{
                    borderTopLeftRadius: '6px',
                    borderEndEndRadius: '6px',
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell-icon lucide-bell">
                    <path d="M10.268 21a2 2 0 0 0 3.464 0" />
                    <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
                  </svg>
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
                  className='w-8 h-8 sm:w-8 sm:h-8 fill-current text-gray-500'
                  fill="currentColor" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                  <g id="SVGRepo_iconCarrier">
                    <path d="M16.108 10.044c-3.313 0-6 2.687-6 6s2.687 6 6 6 6-2.686 6-6-2.686-6-6-6zM16.108 20.044c-2.206 0-4.046-1.838-4.046-4.044s1.794-4 4-4c2.206 0 4 1.794 4 4s-1.748 4.044-3.954 4.044zM31.99 15.768c-0.012-0.050-0.006-0.104-0.021-0.153-0.006-0.021-0.020-0.033-0.027-0.051-0.011-0.028-0.008-0.062-0.023-0.089-2.909-6.66-9.177-10.492-15.857-10.492s-13.074 3.826-15.984 10.486c-0.012 0.028-0.010 0.057-0.021 0.089-0.007 0.020-0.021 0.030-0.028 0.049-0.015 0.050-0.009 0.103-0.019 0.154-0.018 0.090-0.035 0.178-0.035 0.269s0.017 0.177 0.035 0.268c0.010 0.050 0.003 0.105 0.019 0.152 0.006 0.023 0.021 0.032 0.028 0.052 0.010 0.027 0.008 0.061 0.021 0.089 2.91 6.658 9.242 10.428 15.922 10.428s13.011-3.762 15.92-10.422c0.015-0.029 0.012-0.058 0.023-0.090 0.007-0.017 0.020-0.030 0.026-0.050 0.015-0.049 0.011-0.102 0.021-0.154 0.018-0.090 0.034-0.177 0.034-0.27 0-0.088-0.017-0.175-0.035-0.266zM16 25.019c-5.665 0-11.242-2.986-13.982-8.99 2.714-5.983 8.365-9.047 14.044-9.047 5.678 0 11.203 3.067 13.918 9.053-2.713 5.982-8.301 8.984-13.981 8.984z"></path>
                  </g>
                </svg>
                <span className="text-gray-500 text-sm sm:text-base">
                  {formatNumber(anime.popularity)}
                </span>
              </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="relative flex gap-6 flex-col lg:flex-row gap-6 ">
        <SynopsisSection anime={anime} />

        {/* Episodes Section - теперь всегда рендерится, даже для фильмов и спецвыпусков */}
        <EpisodesSection
          episodes={episodes}
          episodesLoading={episodesLoading}
          episodeSearch={episodeSearch}
          setEpisodeSearch={setEpisodeSearch}
          playEpisode={playEpisode}
          anime={anime}
        />
      </div>

      {/* Trailer Modal */}
      {showTrailer && anime.trailer?.youtube_id && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative rounded-2xl overflow-hidden max-w-4xl w-full">
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