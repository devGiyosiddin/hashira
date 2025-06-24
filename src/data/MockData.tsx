import type { Anime } from "../types/anime";

export const mockAnime: Anime[] = [
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