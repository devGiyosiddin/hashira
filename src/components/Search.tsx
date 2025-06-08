import { useRef } from "react";
import { useSearchStore } from "../store/searchStore";
import { Link } from "react-router-dom";

const Search = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const setQuery = useSearchStore((state) => state.setQuery);
  const setFilter = useSearchStore((state) => state.setFilter);
  const results = useSearchStore((state) => state.results);
  const query = useSearchStore((state) => state.query);

  const handleSearch = () => {
    const value = inputRef.current?.value || '';
    setQuery(value);
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter({ genre: e.target.value });
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter({ year: e.target.value });
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Заголовок с градиентом */}
      <div className="text-center mb-8">
        <h3 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2">
          Kengaytirilgan qidiruv
        </h3>
        <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto rounded-full"></div>
      </div>

      {/* Поисковая панель */}
      <div className="relative mb-8 p-6 rounded-3xl bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 shadow-2xl"
           style={{
             background: 'linear-gradient(145deg, rgba(39, 39, 42, 0.8), rgba(24, 24, 27, 0.9))',
             boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
           }}>
        
        {/* Основное поле поиска */}
        <div className="relative mb-6">
          <input
            ref={inputRef}
            type="search"
            placeholder="Anime qidiring..."
            onChange={handleSearch}
            className="w-full py-4 pl-6 pr-16 rounded-2xl border-2 border-purple-500/30 bg-zinc-900/80 backdrop-blur-sm text-lg text-white placeholder:text-gray-400 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 shadow-lg"
            style={{
              background: 'linear-gradient(145deg, rgba(24, 24, 27, 0.9), rgba(39, 39, 42, 0.8))',
              boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(168, 85, 247, 0.1)'
            }}
          />
          
          {/* Анимированная иконка поиска */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg hover:shadow-purple-500/25 transition-all duration-300 cursor-pointer hover:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
        </div>

        {/* Фильтры */}
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-48">
            <select 
              onChange={handleGenreChange} 
              className="w-full px-4 py-3 rounded-xl bg-zinc-900/80 backdrop-blur-sm text-white border border-zinc-600/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 appearance-none cursor-pointer"
              style={{
                background: 'linear-gradient(145deg, rgba(24, 24, 27, 0.9), rgba(39, 39, 42, 0.8))',
                boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)'
              }}
            >
              <option value="">🎭 Hamma janrlar</option>
              <option value="1">⚔️ Ekshen</option>
              <option value="4">😄 Komedia</option>
              <option value="8">🎭 Drama</option>
              <option value="10">🌟 Fentezi</option>
              <option value="22">❤️ Romantika</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="relative flex-1 min-w-48">
            <select 
              onChange={handleYearChange} 
              className="w-full px-4 py-3 rounded-xl bg-zinc-900/80 backdrop-blur-sm text-white border border-zinc-600/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 appearance-none cursor-pointer"
              style={{
                background: 'linear-gradient(145deg, rgba(24, 24, 27, 0.9), rgba(39, 39, 42, 0.8))',
                boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)'
              }}
            >
              <option value="">📅 hamma yillar</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
              <option value="2020">2020</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Декоративные элементы */}
        <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-full blur-lg"></div>
      </div>

      {/* Результаты поиска */}
      {query && (
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
            <p className="text-xl text-white font-medium">
            <span className="text-purple-400 font-bold">"{query}"</span> uchun natijalar...
            </p>
          </div>
        </div>
      )}

      {/* Сетка результатов */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {results.map((anime) => (
          <Link
          key={anime.mal_id}
          to={`/anime/${anime.mal_id}`}
          className="group relative overflow-hidden rounded-2xl bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-purple-500/50 block"
          style={{
            background: 'linear-gradient(145deg, rgba(39, 39, 42, 0.8), rgba(24, 24, 27, 0.9))',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
            {/* Фоновое изображение */}
            <div className="absolute inset-0 z-0">
              <img
                src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url}
                alt={anime.title}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:blur-sm group-hover:brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/95 via-zinc-900/60 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-cyan-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>

            {/* Контент */}
            <div className="relative z-10 h-80 flex flex-col justify-end p-6">
              {/* Рейтинг */}
              {anime.score && (
                <div className="absolute top-4 right-4 bg-yellow-500/90 backdrop-blur-sm text-black px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                  ⭐ {anime.score}
                </div>
              )}

              {/* Жанры */}
              {anime.genres && (
                <div className="absolute top-4 left-4 flex flex-wrap gap-1 max-w-[calc(100%-120px)]">
                  {anime.genres.slice(0, 2).map((genre) => (
                    <span
                      key={genre.mal_id}
                      className="text-xs px-2 py-1 bg-purple-600/80 backdrop-blur-sm text-white rounded-full font-medium shadow-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Заголовок и описание при наведении */}
              <div className="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 drop-shadow-lg">
                  {anime.title_english || anime.title}
                </h3>
                
                {anime.synopsis && (
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {anime.synopsis.slice(0, 120)}{anime.synopsis.length > 120 ? '...' : ''}
                  </p>
                )}

              </div>
              
              {/* Кнопки действий */}
              <div className="flex gap-3 opacity-0 group-hover:opacity-100 absolute bottom-6 left-6 right-6 transition-all duration-500">
                <button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-center py-2.5 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25">
                  Смотреть
                </button>
                <button className="bg-zinc-700/80 backdrop-blur-sm hover:bg-zinc-600/80 text-white p-2.5 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                  </svg>
                </button>
              </div>

              {/* Обычное состояние */}
              <div className="group-hover:opacity-0 group-hover:translate-y-4 transition-all duration-500">
                <h3 className="text-lg font-bold text-white drop-shadow-lg line-clamp-2">
                  {anime.title_english || anime.title}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-gray-400 text-sm">
                    {anime.year || 'N/A'} • {anime.episodes || '?'} эп.
                  </span>
                </div>
              </div>
            </div>
            </Link>
        ))}
      </div>

      {/* Пустое состояние */}
      {results.length === 0 && query && (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 flex items-center justify-center">
            <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Hechnarsa topilmadi.</h3>
          <p className="text-gray-400">Qidiruv so'rovini yoki filtr tanlovini o'zgartirib ko'ring.</p>
        </div>
      )}
    </div>
  );
};

export default Search;