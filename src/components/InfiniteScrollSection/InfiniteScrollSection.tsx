import { useRef, useEffect, useCallback } from "react";
import type { Anime, InfiniteAnimeData } from "../../types/anime";
import { AnimeCard } from "../AnimeCard/AnimeCard";
import { LoadingSpinner } from "../Loading/LoadingSpinner";
import { ErrorMessage } from "../ErrorMsg/ErrorMsg";
import { Section } from "../Section/Section";

interface InfiniteScrollSectionProps {
  title: string;
  icon: string;
  data: InfiniteAnimeData | undefined;
  isLoading: boolean;
  error: Error | null;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

export const InfiniteScrollSection = ({
  title,
  icon,
  data,
  isLoading,
  error,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage
}: InfiniteScrollSectionProps) => {
  const observerRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [target] = entries;
    if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    const element = observerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
      rootMargin: '100px',
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [handleObserver]);

  const allAnime = data?.pages.flatMap(page => page.data) || [];

  return (
    <Section title={title} icon={icon}>
      {isLoading ? (
        <LoadingSpinner size="lg" />
      ) : error ? (
        <ErrorMessage message={error.message} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {allAnime.map((item: Anime) => (
              <AnimeCard key={`${item.mal_id}-${Math.random()}`} item={item} />
            ))}
          </div>

          {/* Observer element for infinite scroll */}
          <div ref={observerRef} className="flex justify-center items-center py-8">
            {isFetchingNextPage && <LoadingSpinner size="md" />}
            {!hasNextPage && allAnime.length > 0 && (
              <p className="text-gray-400 text-center">
                🎉 Вы посмотрели все доступные аниме!
              </p>
            )}
          </div>
        </>
      )}
    </Section>
  );
};