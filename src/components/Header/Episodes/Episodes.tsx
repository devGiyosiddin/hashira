import { useState } from 'react';
import { ChevronRight, Star, Play } from 'lucide-react';
import './episodes.css';

const EpisodesSection = ({ anime, episodes, episodesLoading, playEpisode, isMovieOrSingleEpisode }) => {
  const [selectedSeason, setSelectedSeason] = useState(1);
  
  // Группировка эпизодов по сезонам (если есть данные)
  const seasons = episodes.length > 0 
    ? [{ name: 'Сезон 1', episodes: episodes }]
    : [{ name: 'Сезон 1', episodes: Array.from({ length: anime.episodes || 12 }, (_, i) => ({ id: i + 1 })) }];

  if (isMovieOrSingleEpisode()) return null;

  return (
    <section className="py-20 px-6 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок */}
        <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Смотреть серии
        </h2>

        {/* Табы сезонов */}
        <div className="flex gap-4 mb-8 overflow-x-auto">
          <button className="px-6 py-2 rounded-full border border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 transition-all whitespace-nowrap">
            Номер
          </button>
          <button className="px-6 py-2 rounded-full bg-white text-black font-medium whitespace-nowrap">
            Сезон 1
          </button>
          <button className="px-6 py-2 rounded-full border border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 transition-all whitespace-nowrap">
            Сезон 2
          </button>
        </div>

        {/* Лоадер */}
        {episodesLoading && (
          <div className="flex justify-center mb-8">
            <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Сетка эпизодов */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {seasons[selectedSeason - 1]?.episodes.map((episode, index) => (
            <div
              key={episode.mal_id || index}
              onClick={() => playEpisode(index + 1)}
              className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl overflow-hidden border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-2xl"
            >
              {/* Превью изображение */}
              <div className="relative aspect-video bg-gradient-to-br from-gray-700 to-gray-800 overflow-hidden">
                {episode.images?.jpg?.image_url ? (
                  <img
                    src={episode.images.jpg.image_url}
                    alt={`Episode ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  // Заглушка с градиентом
                  <div className="w-full h-full bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-blue-600/20 flex items-center justify-center">
                    <div className="text-6xl font-bold text-white/20">
                      {index + 1}
                    </div>
                  </div>
                )}
                
                {/* Оверлей с кнопкой играть */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                    <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
                  </div>
                </div>

                {/* Номер эпизода */}
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-1">
                  <span className="text-white font-bold text-sm">Серия {index + 1}</span>
                </div>

                {/* Рейтинг */}
                {episode.score && (
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-white text-xs font-medium">{episode.score}</span>
                  </div>
                )}

                {/* Статусы */}
                <div className="absolute bottom-3 left-3 flex gap-2">
                  {episode.filler && (
                    <span className="px-2 py-1 bg-orange-500/80 backdrop-blur-sm text-white text-xs rounded-full font-medium">
                      Filler
                    </span>
                  )}
                  {episode.recap && (
                    <span className="px-2 py-1 bg-blue-500/80 backdrop-blur-sm text-white text-xs rounded-full font-medium">
                      Recap
                    </span>
                  )}
                </div>
              </div>

              {/* Информация */}
              <div className="p-4">
                <h3 className="font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors line-clamp-1">
                  {episode.title || `Episode ${index + 1}`}
                </h3>
                
                {episode.synopsis && (
                  <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                    {episode.synopsis}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  {episode.aired && (
                    <p className="text-gray-500 text-xs">
                      {new Date(episode.aired).toLocaleDateString('ru-RU')}
                    </p>
                  )}
                  
                  <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-purple-400 transition-colors" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Кнопка загрузить еще */}
        {episodes.length > 20 && (
          <div className="flex justify-center mt-12">
            <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-full transition-all duration-300 hover:scale-105">
              Загрузить еще эпизоды
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default EpisodesSection;