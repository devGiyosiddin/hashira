import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import VideoPlayer from '../../components/VideoPlayer/VideoPlayer';
import EpisodesSection from '../../components/EpisodesSection/EpisodesSection';

// Типы можно вынести в отдельный файл, если потребуется
interface AnimeDetails {
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
}

interface Episode {
  mal_id: number;
  title: string;
  filler?: boolean;
  recap?: boolean;
  image_url?: string;
}

const WatchPage: React.FC = () => {
  const { animeId, episodeNumber } = useParams<{ animeId: string; episodeNumber: string }>();
  const [anime, setAnime] = useState<AnimeDetails | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [episodesLoading, setEpisodesLoading] = useState(false);
  const [episodeSearch, setEpisodeSearch] = useState('');
  const [currentEpisode, setCurrentEpisode] = useState<number>(Number(episodeNumber) || 1);

  useEffect(() => {
    const fetchAnime = async () => {
      const response = await fetch(`https://api.jikan.moe/v4/anime/${animeId}`);
      const data = await response.json();
      setAnime(data.data);
    };
    if (animeId) fetchAnime();
  }, [animeId]);

  useEffect(() => {
    const fetchEpisodes = async () => {
      setEpisodesLoading(true);
      const response = await fetch(`https://api.jikan.moe/v4/anime/${animeId}/episodes`);
      const data = await response.json();
      setEpisodes(data.data || []);
      setEpisodesLoading(false);
    };
    if (animeId) fetchEpisodes();
  }, [animeId]);

  useEffect(() => {
    if (episodeNumber) setCurrentEpisode(Number(episodeNumber));
  }, [episodeNumber]);

  // Для примера: видеофайл для теста
  const getVideoSource = () => {
    // Здесь можно реализовать реальную логику выбора источника видео по номеру серии
    // Например, если есть массив ссылок на видео по эпизодам
    // Пока что возвращаем тестовый файл
    return '/public/test.mp4';
  };

  const handlePlayEpisode = (epNum?: number) => {
    if (epNum) setCurrentEpisode(epNum);
    // Здесь можно реализовать переход по роуту, если нужно
  };

  if (!anime) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto pt-8">
        <h1 className="text-3xl font-bold text-white mb-4 text-center">
          {anime.title_english || anime.title} — {currentEpisode}-серия
        </h1>
        <div className="rounded-xl overflow-hidden shadow-lg mb-8">
          <VideoPlayer
            source={getVideoSource()}
            type={getVideoSource().endsWith('.m3u8') ? 'hls' : 'video'}
            title={`${anime.title_english || anime.title} — ${currentEpisode}-серия`}
            poster={anime.images.jpg.large_image_url}
          />
        </div>
      </div>
      <div className="max-w-6xl mx-auto">
        <EpisodesSection
          episodes={episodes}
          episodesLoading={episodesLoading}
          episodeSearch={episodeSearch}
          setEpisodeSearch={setEpisodeSearch}
          playEpisode={(epNum) => {}}
          anime={anime}
        />
      </div>
    </div>
  );
};

export default WatchPage; 