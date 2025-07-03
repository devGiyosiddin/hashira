import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shuffle } from "lucide-react";

const RandomAnimeButton: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRandom = useCallback(async () => {
    setLoading(true);
    try {
      const page = Math.floor(Math.random() * 100) + 1;
      const url = `https://api.jikan.moe/v4/anime?page=${page}&limit=24&order_by=popularity`;
      const response = await fetch(url);
      const data = await response.json();
      const list = data.data;
      if (Array.isArray(list) && list.length > 0) {
        const randomAnime = list[Math.floor(Math.random() * list.length)];
        if (randomAnime?.mal_id) {
          navigate(`/anime/${randomAnime.mal_id}`);
        }
      }
    } catch (e) {
      console.error(e, "Ошибка при получении случайного аниме");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  return (
    <button
      type="button"
      onClick={handleRandom}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white shadow transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
      title="Случайное аниме"
    >
      <Shuffle className="w-5 h-5" />
      <span>Случайное аниме</span>
    </button>
  );
};

export default RandomAnimeButton;