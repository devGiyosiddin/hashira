import { useNavigate } from "react-router-dom";
import './heroBanner.css';

// Временные данные аниме с id 40748
const bannerAnime = {
  mal_id: 40748,
  title: "Jujutsu Kaisen",
  title_english: "Jujutsu Kaisen",
  images: {
    jpg: {
      image_url: "https://cdn.myanimelist.net/images/anime/1171/109222.jpg",
      large_image_url: "https://cdn.myanimelist.net/images/anime/1171/109222l.jpg"
    }
  },
  score: 8.8,
  synopsis: "Lanatlangan olam, Jujutsu Kaisen, birinchi kurs talabasi Yuji Itadori o'zining kuchli ruhiy qobiliyatlari bilan tanilgan. U o'z do'stlarini himoya qilish uchun kuchli ruhlarni yengishga tayyor.",
};

export const HeroBanner = () => {
  const navigate = useNavigate();

  return (
    <div className="relative grid grid-cols-1 auto-rows-fr min-h-48 sm:min-h-56 md:min-h-64 lg:min-h-72 xl:min-h-80 2xl:min-h-96 max-h-48 sm:max-h-56 md:max-h-64 lg:max-h-72 xl:max-h-80 2xl:max-h-96 rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden mb-6 sm:mb-8 md:mb-10 lg:mb-12">
      <div className="absolute inset-0 z-0">
        <video
          src="/one-chance.mp4"
          typeof="video/mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover transform scale-100 sm:scale-105 lg:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-black/20 sm:from-black/80 sm:via-black/40 sm:to-transparent"></div>
      </div>
      
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 sm:gap-6 md:gap-8 items-end p-4 sm:p-6 md:p-8 lg:p-10">
        <div className="space-y-2 sm:space-y-3 md:space-y-4 min-w-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-white leading-tight break-words">
            {bannerAnime.title_english || bannerAnime.title}
          </h1>
          <p className="text-gray-200 text-xs sm:text-sm md:text-base lg:text-lg line-clamp-2 sm:line-clamp-3 leading-relaxed">
            {bannerAnime.synopsis}
          </p>
        </div>
        
        <div className="flex justify-start sm:justify-end">
          <button
            className="inline-flex items-center justify-center bg-white text-black px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-200 text-sm sm:text-base w-full sm:w-auto shadow-lg hover:shadow-xl"
            onClick={() => navigate(`/anime/${bannerAnime.mal_id}`)}
          >
            <span className="mr-2">▶</span>
            <span>Ko'rish</span>
          </button>
        </div>
      </div>
    </div>
  );
};