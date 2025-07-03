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

// Mock data for continue watching
export const continueWatchingData = [
  {
    mal_id: 1,
    title: "Attack on Titan",
    title_english: "Attack on Titan",
    images: {
      jpg: {
        image_url: "https://cdn.myanimelist.net/images/anime/10/47347.jpg",
        large_image_url: "https://cdn.myanimelist.net/images/anime/10/47347l.jpg"
      }
    },
    score: 9.0,
    synopsis: "Humanity fights for survival against the Titans, gigantic humanoid creatures who devour humans seemingly without reason.",
    watchedEpisodes: 18,
    totalEpisodes: 25,
    lastWatched: "2 days ago"
  },
  {
    mal_id: 2,
    title: "Demon Slayer",
    title_english: "Demon Slayer: Kimetsu no Yaiba",
    images: {
      jpg: {
        image_url: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg",
        large_image_url: "https://cdn.myanimelist.net/images/anime/1286/99889l.jpg"
      }
    },
    score: 8.7,
    synopsis: "A young boy becomes a demon slayer to save his sister and avenge his family.",
    watchedEpisodes: 15,
    totalEpisodes: 26,
    lastWatched: "1 day ago"
  },
  {
    mal_id: 3,
    title: "My Hero Academia",
    title_english: "My Hero Academia",
    images: {
      jpg: {
        image_url: "https://cdn.myanimelist.net/images/anime/10/78745.jpg",
        large_image_url: "https://cdn.myanimelist.net/images/anime/10/78745l.jpg"
      }
    },
    score: 8.5,
    synopsis: "In a world where superpowers are common, a boy without powers dreams of becoming a hero.",
    watchedEpisodes: 8,
    totalEpisodes: 13,
    lastWatched: "3 days ago"
  },
  {
    mal_id: 4,
    title: "One Piece",
    title_english: "One Piece",
    images: {
      jpg: {
        image_url: "https://cdn.myanimelist.net/images/anime/6/73245.jpg",
        large_image_url: "https://cdn.myanimelist.net/images/anime/6/73245l.jpg"
      }
    },
    score: 9.1,
    synopsis: "Monkey D. Luffy and his pirate crew explore the Grand Line to find the greatest treasure ever left by the legendary Pirate, Gold Roger.",
    watchedEpisodes: 1050,
    totalEpisodes: 1000,
    lastWatched: "5 hours ago"
  },
  {
    mal_id: 5,
    title: "Jujutsu Kaisen",
    title_english: "Jujutsu Kaisen",
    images: {
      jpg: {
        image_url: "https://cdn.myanimelist.net/images/anime/1171/109222.jpg",
        large_image_url: "https://cdn.myanimelist.net/images/anime/1171/109222l.jpg"
      }
    },
    score: 8.8,
    synopsis: "A student joins a secret organization of sorcerers to kill a powerful Curse born from his own negative emotions.",
    watchedEpisodes: 12,
    totalEpisodes: 24,
    lastWatched: "1 week ago"
  }
];