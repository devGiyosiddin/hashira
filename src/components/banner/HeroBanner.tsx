import type { Anime } from "../../types/anime";
import './heroBanner.css';

interface HeroBannerProps {
  anime: Anime;
}

export const HeroBanner = ({ anime }: HeroBannerProps) => (
  <div className="relative h-76 rounded-3xl overflow-hidden mb-12">
    <div className="absolute inset-0">
      <video 
        src="/one-chance.mp4" 
        typeof='video/mp4' 
        autoPlay 
        loop 
        muted 
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
    </div>
    
    <div className="relative z-10 h-full flex items-end justify-between p-8">
        <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {anime.title_english || anime.title}
            </h1>
            <p className="text-gray-200 text-lg mb-6 line-clamp-3">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates deserunt porro repellendus incidunt natus minima.
            </p>
        </div>
        <button className="inline-flex items-center bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
          <span className="mr-2">▶</span>
          Смотреть
        </button>
    </div>
  </div>
);