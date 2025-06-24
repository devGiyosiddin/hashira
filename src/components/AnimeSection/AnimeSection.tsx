import { Anime } from "../../types/anime";
import { AnimeCard } from "../AnimeCard/AnimeCard";
import { LoadingSpinner } from "../Loading/LoadingSpinner";
import { ErrorMessage } from "../ErrorMsg/ErrorMsg";
import { Section } from "../Section/Section";
import './animeSection.css';

interface AnimeSectionProps {
    title: string;
    data: Anime[];
    isLoading: boolean;
    error: Error | null;
    icon: string;
}

export const AnimeSection = ({ title, data, isLoading, error, icon }: AnimeSectionProps) => (
    <Section title={title} icon={icon}>
    {isLoading ? (
        <LoadingSpinner size="lg" />
    ) : error ? (
        <ErrorMessage message={error.message} />
    ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {data?.map((item: Anime) => (
            <AnimeCard key={item.mal_id} item={item} />
        ))}
        </div>
    )}
    </Section>
);