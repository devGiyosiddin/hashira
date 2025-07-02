import React from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Локальные типы для избежания ошибок импорта
type AnimeDetails = {
  mal_id: number;
  title: string;
  title_english?: string;
  images: {
    jpg: {
      image_url: string;
      large_image_url: string;
    };
  };
  type?: string;
  episodes?: number;
  duration?: string;
  year?: number;
  season?: string;
  genres?: Array<{ mal_id: number; name: string }>;
};

type Episode = {
  mal_id: number;
  title: string;
  filler?: boolean;
  recap?: boolean;
  image_url?: string;
};

interface EpisodesSectionProps {
  episodes: Episode[];
  episodesLoading: boolean;
  episodeSearch: string;
  setEpisodeSearch: (v: string) => void;
  playEpisode: (epNum?: number) => void;
  anime: AnimeDetails;
}

// Helper: получить номер серии для карточки
const getEpisodeNumber = (episode: Episode, index: number): number => {
  if ('number' in episode && typeof episode.number === 'number') return episode.number;
  if ('mal_id' in episode && typeof episode.mal_id === 'number') return episode.mal_id;
  return index + 1;
};

const EpisodesSection: React.FC<EpisodesSectionProps> = ({
  episodes,
  episodesLoading,
  episodeSearch,
  setEpisodeSearch,
  playEpisode,
  anime,
}) => {
  const navigate = useNavigate();
  const handlePlay = (epNum: number) => {
    navigate(`/watch/${anime.mal_id}/${epNum}`);
    if (playEpisode) playEpisode(epNum);
  };

  return (
    <section className="w-full lg:w-[65%] py-20 pr-0">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-bold">
              {anime.episodes && anime.episodes > 1 ? `Serialarni ko'rish (${anime.episodes})` : 'Film haqida'}
            </h2>
            {/* Сезон, если есть */}
            {anime.season && (
              <span className="text-gray-500 text-sm">
                {` (${anime.season})`}
              </span>
            )}
          </div>
          {episodesLoading && (
            <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
          )}
        </div>
        {/* Внешний input для фильтрации по номеру эпизода */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-full max-w-xs">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </span>
            <input
              type="number"
              min={1}
              max={anime.episodes || undefined}
              value={episodeSearch}
              onChange={e => setEpisodeSearch(e.target.value.replace(/[^\d]/g, ''))}
              placeholder="Номер серии..."
              className="block w-full pl-10 pr-4 py-3 rounded-full bg-transparent border border-slate-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 text-white placeholder-gray-400 transition-all duration-200 outline-none shadow-sm no-spinner"
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Если это фильм, спецвыпуск, OVA и т.д. с 1 эпизодом — показываем только одну карточку */}
          {anime.episodes === 1 && anime.images?.jpg && (anime.title_english || anime.title) ? (
            <div
              className="relative flex flex-col justify-end rounded-xl overflow-hidden transition-all duration-300 cursor-pointer border border-slate-700 hover:border-purple-500/50 shadow-lg group h-[260px] md:h-[320px] xl:h-[360px]"
              style={{ backgroundImage: `url(${anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || ''})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/60 group-hover:bg-black/0 transition-all duration-300 z-0" />
              {/* Контент карточки */}
              <div className="relative z-10 flex flex-col items-center justify-end h-full p-4">
                <div className="w-full rounded-lg flex text-white font-bold text-base justify-center drop-shadow-lg text-center">
                  {anime.title_english || anime.title}
                </div>
                <div className="text-gray-200 text-xs truncate mt-1 text-center drop-shadow-lg">
                  {anime.duration && <span>Длительность: {anime.duration}</span>}
                  {anime.year && <span className="ml-2">Год: {anime.year}</span>}
                </div>
                <button
                  onClick={() => handlePlay(1)}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-1 px-4 rounded-full shadow-lg transition-all duration-300 text-xs mt-3"
                >
                  Смотреть фильм
                </button>
              </div>
            </div>
          ) : (
            <>
              {episodes.length > 0 ? (
                episodes
                  .filter((episode, index) => {
                    if (!episodeSearch) return true;
                    return getEpisodeNumber(episode, index).toString().includes(episodeSearch);
                  })
                  .map((episode, index) => {
                    const epNumber = getEpisodeNumber(episode, index);
                    return (
                      <div
                        key={episode.mal_id}
                        onClick={() => handlePlay(epNumber)}
                        className="relative flex flex-col justify-end rounded-xl overflow-hidden transition-all duration-300 cursor-pointer border border-slate-700 hover:border-purple-500/50 shadow-lg group h-[260px] bg-cover bg-center"
                        style={{ backgroundImage: `url(${('image_url' in episode && episode.image_url) ? episode.image_url : anime.images.jpg.large_image_url})` }}
                      >
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/60 group-hover:bg-black/0 transition-all duration-300 z-0" />
                        {/* Контент карточки */}
                        <div className="relative z-10 flex flex-col items-center justify-end h-full p-4">
                          <div className="flex gap-2 mb-2">
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
                          <div className="w-full rounded-lg flex text-white font-bold mt-auto text-base justify-center drop-shadow-lg text-center">
                            {`${epNumber || ''}-seria`}
                          </div>
                          <div className="text-gray-200 text-xs truncate mt-1 text-center drop-shadow-lg">
                            {episode.title || ''}
                          </div>
                        </div>
                      </div>
                    );
                  })
              ) : (
                // Fallback: Generate episode list based on episode count
                Array.from({ length: anime.episodes || 0 }, (_, index) => index + 1)
                  .filter(num => !episodeSearch || num.toString().includes(episodeSearch))
                  .map(num => (
                    <div
                      key={num}
                      onClick={() => handlePlay(num)}
                      className="relative flex flex-col justify-end rounded-xl overflow-hidden transition-all duration-300 cursor-pointer border border-slate-700 hover:border-purple-500/50 shadow-lg group h-[260px] md:h-[320px] xl:h-[360px] bg-cover bg-center"
                      style={{ backgroundImage: `url(${anime.images.jpg.large_image_url})` }}
                    >
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/60 group-hover:bg-black/0 transition-all duration-300 z-0" />
                      {/* Контент карточки */}
                      <div className="relative z-10 flex flex-col items-center justify-end h-full p-4">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold bg-purple-700/30 mx-auto mb-2">
                          {num}
                        </div>
                        <h3 className="font-semibold text-white text-center mt-2 drop-shadow-lg">
                          {num} - seria
                        </h3>
                      </div>
                    </div>
                  ))
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default EpisodesSection; 