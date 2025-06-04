import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useSearchStore } from "../store/searchStore";
import { useDebounce } from "use-debounce";

const fetchSearchedAnime = async (animeName: string) => {
  const url = `https://api.jikan.moe/v4/anime?q=${animeName}&limit=10`;
  const response = await fetch(url);
  const data = await response.json();
  return data.data;
};

const HomePage = () => {
  const rawQuery = useSearchStore((state) => state.query);
  const [debouncedQuery] = useDebounce(rawQuery, 600);

  const { data: animeList, isLoading, error } = useQuery({
    queryKey: ["searchedAnime", debouncedQuery],
    queryFn: () => fetchSearchedAnime(debouncedQuery),
    enabled: !!debouncedQuery,
  });

  return (
    <>
      <div className="px-4 sm:px-8 lg:px-16 py-8 bg-gray-50 min-h-screen">
        <FontAwesomeIcon icon={faSearch} />

        <section className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-600 mb-4">
            Hashira - anime portaliga xush kelibsiz! ✨
          </h1>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            Твой личный аниме-мир: новости, аниме, манга, форум, маркет и многое другое
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            📰 Найденные аниме
          </h2>

          {isLoading ? (
            <p className="text-blue-500 animate-pulse">Загрузка...</p>
          ) : error ? (
            <p className="text-red-500">Ошибка загрузки: {error.message}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {animeList?.map((item: any) => (
                <div
                  key={item.mal_id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300"
                >
                  <img
                    src={item.images.jpg.image_url}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">
                      {item.title.length > 60
                        ? item.title.slice(0, 60) + "..."
                        : item.title}
                    </h3>
                    <Link
                      to="/news"
                      className="text-blue-500 hover:underline text-sm"
                    >
                      Читать далее →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="text-center mt-16">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-700 mb-4">
            📌 Дальше будет ещё интереснее
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Ты сможешь смотреть аниме, читать мангу и ранобэ, участвовать в чате и форуме, покупать мерч и создавать галереи, как в Pinterest.
          </p>
        </section>
      </div>
    </>
  );
};

export default HomePage;