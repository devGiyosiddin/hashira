import { Link } from "react-router-dom";
import type { Anime } from "../../types/anime";
import "./animeCard.css";

interface AnimeCardProps {
  item: Anime;
  variant?: 'default' | 'compact';
}

export const AnimeCard = ({ item, variant = 'default' }: AnimeCardProps) => {
  if (variant === 'compact') {
    return (
      <div className="group relative block cursor-pointer max-w-sm mx-auto">
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gray-800">
          <img
            src={item.images.jpg.large_image_url || item.images.jpg.image_url}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          
          {/* Duration badge */}
          <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
            02:07
          </div>
          
          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="text-white text-sm mb-1">
              {item.episodes || 4} серия, 1 сезон
            </div>
            <h3 className="text-white font-medium line-clamp-1">
              {item.title_english || item.title}
            </h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link 
      to={`/anime/${item.mal_id}`}
      className="group relative overflow-hidden rounded-2xl bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-[1.02] hover:border-purple-500/50 block max-w-sm mx-auto w-full"
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
          className="w-full h-full object-cover transition-all duration-200 group-hover:scale-110 group-hover:blur-sm group-hover:brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/95 via-zinc-900/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-cyan-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
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
        <div className="mt-auto transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 delay-100">
          <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 drop-shadow-lg">
            {item.title_english || item.title}
          </h3>
          
          <p className="text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
            {item.synopsis 
              ? item.synopsis.slice(0, 120) + (item.synopsis.length > 120 ? '...' : '')
              : 'Описание недоступно'}
          </p>
        </div>

        {/* Watch indicator */}
        <div className="opacity-0 group-hover:opacity-100 absolute bottom-6 left-6 transition-all duration-200 z-20">
          <div className="bg-(--grey-color) text-white py-1.5 px-3 rounded-lg text-sm font-semibold">
            👁️ Ko'rish
          </div>
        </div>

        {/* Default state - Only title visible */}
        <div className="group-hover:opacity-0 group-hover:translate-y-4 transition-all duration-200">
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