import './animeDetailPage.css';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Play, Heart, Bookmark, Share2, Users, Award, TrendingUp, ChevronRight, SkipBack, SkipForward } from 'lucide-react';
import VideoPlayer from '../../components/VideoPlayer/VideoPlayer';
import '@videojs/themes/dist/forest/index.css'; // или 'city', 'fantasy', 'sea'
import videojs from 'video.js';
import {PlayCircle, Maximize} from 'lucide-react';
type Player = videojs.Player;

type AnimeDetails = {
  mal_id: number;
  title: string;
  title_english?: string;
  title_japanese?: string;
  type?: string; // Added to check if it's a movie or TV series
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
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState<number>(1);

  const playerRef = useRef<Player | null>(null);
  const videoRef = useRef<HTMLDivElement | null>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);

  // Проверка: фильм или 1 эпизод
  const isMovieOrSingleEpisode = () => {
    return anime && (anime.type === 'Movie' || anime.episodes === 1);
  };

  const nextEpisode = () => {
    if (anime && currentEpisode < (anime.episodes || 0)) {
      setCurrentEpisode((prev) => prev + 1);
    }
  };

  const previousEpisode = () => {
    if (currentEpisode > 1) {
      setCurrentEpisode((prev) => prev - 1);
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
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
            filter: 'blur(3px) brightness(0.3)',
          }}
        />
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-slate-900/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-transparent to-slate-900/80" />
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-purple-500/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-6 lg:px-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-8">
                {/* Title */}
                <div className="space-y-4">
                  <h1 className="text-5xl lg:text-7xl font-black tracking-tight">
                    <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                      {anime.title_english || anime.title}
                    </span>
                  </h1>
                  {anime.title_japanese && (
                    <p className="text-xl text-gray-400 font-light">
                      {anime.title_japanese}
                    </p>
                  )}
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-6">
                  {anime.score && (
                    <div className="flex items-center gap-2 bg-yellow-500/20 px-4 py-2 rounded-full border border-yellow-500/30">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="font-bold text-yellow-400">{anime.score}</span>
                      <span className="text-gray-400 text-sm">({anime.scored_by?.toLocaleString()})</span>
                    </div>
                  )}
                  {anime.rank && (
                    <div className="flex items-center gap-2 bg-purple-500/20 px-4 py-2 rounded-full border border-purple-500/30">
                      <Award className="w-5 h-5 text-purple-400" />
                      <span className="font-bold text-purple-400">#{anime.rank}</span>
                    </div>
                  )}
                  {anime.popularity && (
                    <div className="flex items-center gap-2 bg-pink-500/20 px-4 py-2 rounded-full border border-pink-500/30">
                      <TrendingUp className="w-5 h-5 text-pink-400" />
                      <span className="font-bold text-pink-400">#{anime.popularity}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  {/* Watch Now Button - Show for all anime */}
                  <button
                    onClick={() => isMovieOrSingleEpisode() ? setShowVideoPlayer(true) : playEpisode(1)}
                    className="flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-8 py-4 rounded-full font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
                  >
                    <PlayCircle className="w-5 h-5 fill-current" />
                    {isMovieOrSingleEpisode() ? 'Watch Now' : 'Watch Episode 1'}
                  </button>

                  {anime.trailer?.youtube_id && (
                    <button
                      onClick={() => setShowTrailer(!showTrailer)}
                      className="flex items-center gap-3 bg-gray-800/50 text-gray-300 border border-gray-600/50 hover:bg-gray-700/50 px-6 py-4 rounded-full font-bold transition-all duration-300 transform hover:scale-105"
                    >
                      <Play className="w-5 h-5 fill-current" />
                      Trailer
                    </button>
                  )}
                  
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`flex items-center gap-3 px-8 py-4 rounded-full font-bold transition-all duration-300 transform hover:scale-105 ${
                      isFavorite 
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                        : 'bg-gray-800/50 text-gray-300 border border-gray-600/50 hover:bg-red-500/20 hover:text-red-400'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                    {isFavorite ? 'Favorited' : 'Add to Favorites'}
                  </button>
                  
                  <button
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`flex items-center gap-3 px-6 py-4 rounded-full font-bold transition-all duration-300 transform hover:scale-105 ${
                      isBookmarked 
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                        : 'bg-gray-800/50 text-gray-300 border border-gray-600/50 hover:bg-cyan-500/20 hover:text-cyan-400'
                    }`}
                  >
                    <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                  </button>
                  
                  <button className="flex items-center gap-3 px-6 py-4 rounded-full font-bold bg-gray-800/50 text-gray-300 border border-gray-600/50 hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Right Content - Poster */}
              <div className="flex justify-center lg:justify-end">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <div className="relative overflow-hidden rounded-3xl shadow-2xl transform rotate-3 group-hover:rotate-0 transition-transform duration-500">
                    <img
                      src={anime.images.jpg.large_image_url}
                      alt={anime.title}
                      className="w-80 h-auto object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-purple-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-purple-400 rounded-full mt-2 animate-pulse"></div>
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
              {anime.genres && anime.genres.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold text-purple-400 mb-6">Genres</h3>
                  <div className="flex flex-wrap gap-3">
                    {anime.genres.map((genre) => (
                      <span
                        key={genre.mal_id}
                        className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30 font-medium hover:bg-purple-500/30 transition-colors duration-300 cursor-pointer"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

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

        {/* Studios */}
        {anime.studios && anime.studios.length > 0 && (
          <section className="py-20 px-6 lg:px-16">
            <div className="container mx-auto max-w-6xl">
              <h3 className="text-2xl font-bold text-cyan-400 mb-6">Studios</h3>
              <div className="flex flex-wrap gap-4">
                {anime.studios.map((studio, index) => (
                  <div
                    key={index}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 rounded-xl border border-cyan-500/30 font-bold hover:from-cyan-500/30 hover:to-blue-500/30 transition-all duration-300 cursor-pointer transform hover:scale-105"
                  >
                    {studio.name}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Video Player Modal */}
      {showVideoPlayer && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div className="w-full h-full">
            <VideoPlayer 
              options={{
                autoplay: true,
                controls: true,
                responsive: true,
                fluid: true,
                sources: [{
                  src: '/test.mp4', // Локальный тестовый файл
                  type: 'video/mp4'
                }]
              }}
              onReady={player => {
                playerRef.current = player;
                player.httpSourceSelector({ default: 'auto' });
                player.controlBar.addChild('QualitySelector');
              }}
              
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50 text-white flex items-center justify-between">
                <h3 className="text-lg">Episode {currentEpisode}: {episodes.find(e => e.mal_id === currentEpisode)?.title || ''}</h3>
                <div className="flex items-center space-x-4">
                    <button onClick={previousEpisode} disabled={currentEpisode === 1} className="disabled:opacity-50"><SkipBack /></button>
                    <button onClick={nextEpisode} disabled={currentEpisode === (anime?.episodes || 0)} className="disabled:opacity-50"><SkipForward /></button>
                </div>
                      <>
                        <button
                          onClick={previousEpisode}
                          disabled={currentEpisode <= 1}
                          className="p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <SkipBack className="w-6 h-6 text-white" />
                        </button>
                        
                        <button
                          onClick={nextEpisode}
                          disabled={currentEpisode >= (anime.episodes || 0)}
                          className="p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <SkipForward className="w-6 h-6 text-white" />
                        </button>
                      </>
                    
                    <button
                      onClick={() => {
                        if (videoRef.current) {
                          if (videoRef.current.requestFullscreen) {
                            videoRef.current.requestFullscreen();
                          }
                        }
                      }}
                      className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <Maximize className="w-6 h-6 text-white" />
                    </button>
            </div>
          </div>
        </div>
      )}
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
      <section className="py-10 px-6 lg:px-16">
  <div className="container mx-auto max-w-4xl">
    <h2 className="text-2xl font-bold mb-4">Смотреть онлайн</h2>
    <div className="relative bg-black rounded-xl overflow-hidden shadow-lg">
      <VideoPlayer
        options={{
          autoplay: false,
          controls: true,
          responsive: true,
          fluid: true,
          sources: [{
            src: '/test.mp4',
            type: 'video/mp4'
          }],
          playbackRates: [0.5, 1, 1.25, 1.5, 2]
        }}
        onReady={player => {
          playerRef.current = player;
        }}
      />
      {/* Кастомные кнопки */}
      {/* <div className="absolute bottom-4 left-4 flex gap-2 z-10">
        <button
          onClick={() => playerRef.current && playerRef.current.currentTime(playerRef.current.currentTime() - 10)}
          className="bg-gray-800 text-white px-3 py-2 rounded hover:bg-purple-600 transition"
        >⏪ 10с</button>
        <button
          onClick={() => playerRef.current && playerRef.current.currentTime(playerRef.current.currentTime() + 10)}
          className="bg-gray-800 text-white px-3 py-2 rounded hover:bg-purple-600 transition"
        >10с ⏩</button>
        <button
          onClick={() => playerRef.current && playerRef.current.playbackRate(1)}
          className="bg-gray-800 text-white px-3 py-2 rounded hover:bg-purple-600 transition"
        >1x</button>
        <button
          onClick={() => playerRef.current && playerRef.current.playbackRate(1.5)}
          className="bg-gray-800 text-white px-3 py-2 rounded hover:bg-purple-600 transition"
        >1.5x</button>
        <button
          onClick={() => playerRef.current && playerRef.current.playbackRate(2)}
          className="bg-gray-800 text-white px-3 py-2 rounded hover:bg-purple-600 transition"
        >2x</button>
        <button
          onClick={() => {
            const el = playerRef.current?.el();
            if (el && el.requestFullscreen) el.requestFullscreen();
          }}
          className="bg-gray-800 text-white px-3 py-2 rounded hover:bg-purple-600 transition"
        >⛶</button>
      </div> */}
    </div>
  </div>
</section>
    </div>
  );
};

export default AnimeDetailPage;