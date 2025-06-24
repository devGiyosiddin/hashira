import React, { useEffect, useRef, useCallback } from 'react';


// Mock data and types for demonstration
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

// Mock data
const mockAnime: Anime[] = [
  {
    mal_id: 1,
    title: "Монолог фармацевта",
    title_english: "The Apothecary Diaries",
    images: {
      jpg: {
        image_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop",
        large_image_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1200&fit=crop"
      }
    },
    score: 8.7,
    synopsis: "Эта пушечка обошла всех. Смотреть обязательно челики",
    genres: [{ mal_id: 1, name: "Драма" }, { mal_id: 2, name: "Исторический" }],
    year: 2023,
    episodes: 24
  },
  {
    mal_id: 2,
    title: "Ангел по соседству",
    title_english: "The Angel Next Door",
    images: {
      jpg: {
        image_url: "https://images.unsplash.com/photo-1558618068-fcd65c85cd64?w=400&h=600&fit=crop",
        large_image_url: "https://images.unsplash.com/photo-1558618068-fcd65c85cd64?w=800&h=1200&fit=crop"
      }
    },
    score: 7.8,
    synopsis: "История о соседке-ангеле и парне, который живет рядом",
    genres: [{ mal_id: 3, name: "Романтика" }, { mal_id: 4, name: "Школа" }],
    year: 2023,
    episodes: 12
  },
  {
    mal_id: 3,
    title: "Акира",
    title_english: "Akira",
    images: {
      jpg: {
        image_url: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=400&h=600&fit=crop",
        large_image_url: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=800&h=1200&fit=crop"
      }
    },
    score: 8.0,
    synopsis: "Классика киберпанк аниме",
    genres: [{ mal_id: 5, name: "Экшен" }, { mal_id: 6, name: "Научная фантастика" }],
    year: 1988,
    episodes: 1
  },
  {
    mal_id: 4,
    title: "Токийские мстители",
    title_english: "Tokyo Revengers",
    images: {
      jpg: {
        image_url: "https://images.unsplash.com/photo-1606915254717-4e30de0dd1b8?w=400&h=600&fit=crop",
        large_image_url: "https://images.unsplash.com/photo-1606915254717-4e30de0dd1b8?w=800&h=1200&fit=crop"
      }
    },
    score: 8.1,
    synopsis: "Парень возвращается в прошлое чтобы спасти девушку",
    genres: [{ mal_id: 7, name: "Драма" }, { mal_id: 8, name: "Сверхъестественное" }],
    year: 2021,
    episodes: 24
  }
];

// Hero Banner Component
const HeroBanner = ({ anime }: { anime: Anime }) => (
  <div className="relative h-96 rounded-3xl overflow-hidden mb-12">
    <div className="absolute inset-0">
      <img
        src={anime.images.jpg.large_image_url || anime.images.jpg.image_url}
        alt={anime.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
    </div>
    
    <div className="relative z-10 h-full flex items-center px-8">
      <div className="max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          {anime.title_english || anime.title}
        </h1>
        <p className="text-gray-200 text-lg mb-6 line-clamp-3">
          {anime.synopsis 
            ? anime.synopsis.slice(0, 200) + (anime.synopsis.length > 200 ? '...' : '')
            : 'Описание недоступно'}
        </p>
        <button className="inline-flex items-center bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
          <span className="mr-2">▶</span>
          Смотреть
        </button>
      </div>
    </div>
  </div>
);

// Compact Anime Card for Continue Watching
const CompactAnimeCard = ({ item }: { item: Anime }) => (
  <div className="group relative block cursor-pointer">
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

// Standard Anime Card for grid layouts
const AnimeCard = ({ item }: { item: Anime }) => (
  <div className="group relative block cursor-pointer">
    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-800">
      <img
        src={item.images.jpg.large_image_url || item.images.jpg.image_url}
        alt={item.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      
      {/* Rating badge */}
      <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center">
        ★ {item.score || '7.0'}
      </div>
      
      {/* Title overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
        <h3 className="text-white font-medium line-clamp-2">
          {item.title_english || item.title}
        </h3>
      </div>
    </div>
  </div>
);

// Section Component
const Section = ({ title, children, showAll = false }: {
  title: string;
  children: React.ReactNode;
  showAll?: boolean;
}) => (
  <section className="mb-12">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      {showAll && (
        <button className="text-gray-400 hover:text-white text-sm">
          Посмотреть все
        </button>
      )}
    </div>
    {children}
  </section>
);

const HomePage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Banner */}
        <HeroBanner anime={mockAnime[0]} />

        {/* Continue Watching Section */}
        <Section title="Продолжить просмотр">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockAnime.slice(0, 4).map((item) => (
              <CompactAnimeCard key={item.mal_id} item={item} />
            ))}
          </div>
        </Section>

        {/* All Anime Section */}
        <Section title="Всё аниме" showAll={true}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {[...mockAnime, ...mockAnime, ...mockAnime].map((item, index) => (
              <AnimeCard key={`${item.mal_id}-${index}`} item={item} />
            ))}
          </div>
        </Section>

        {/* Vanguard Category */}
        <Section title="Авангард" showAll={true}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {mockAnime.map((item) => (
              <AnimeCard key={`vanguard-${item.mal_id}`} item={item} />
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
};

export default HomePage;