import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSliders, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

type AnimeSearchResult = {
    mal_id: number;
    title: string;
    title_english?: string;
    images: {
        jpg: {
            image_url: string;
        };
    };
    score?: number;
};

const fetchSearchedAnime = async (animeName: string): Promise<AnimeSearchResult[]> => {
    const url = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(animeName)}&limit=8`;
    const response = await fetch(url);
    const data = await response.json();
    return data.data || [];
};

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<AnimeSearchResult[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchContainerRef = useRef<HTMLDivElement>(null);

    // Debounce search
    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (searchQuery.trim()) {
                setIsSearching(true);
                try {
                    const results = await fetchSearchedAnime(searchQuery);
                    setSearchResults(results);
                    setShowDropdown(true);
                } catch (error) {
                    console.error("Ошибка поиска:", error);
                    setSearchResults([]);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults([]);
                setShowDropdown(false);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchContainerRef.current &&
                !searchContainerRef.current.contains(event.target as Node)
            ) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleAnimeSelect = (anime: AnimeSearchResult) => {
        setShowDropdown(false);
        setSearchQuery("");
        navigate(`/anime/${anime.mal_id}`);
    };

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
    
    return (
        <header
            className="sticky top-0 z-50 overflow-visible border-b border-zinc-700/30"
            style={{
                background: scrolled 
                    ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(24, 24, 27, 0.95))' 
                    : 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(24, 24, 27, 0.8))',
                backdropFilter: "blur(20px)",
                boxShadow: scrolled 
                    ? "0 8px 32px rgba(147, 51, 234, 0.3), 0 0 0 1px rgba(147, 51, 234, 0.1)" 
                    : "0 4px 16px rgba(0, 0, 0, 0.3)"
            }}
        >
            <div className="relative z-10 flex items-center justify-between px-4 sm:px-8 lg:px-16 py-4">
                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-3 group relative select-none"
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-purple-500/50 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <img
                                className="w-12 h-12 sm:w-14 sm:h-14 object-contain rounded-full"
                                src="../../public/logos/violet-logo.png"
                                alt="Hashira website logo"
                            />
                        </div>
                    </div>
                    <span className="text-2xl sm:text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 group-hover:from-cyan-400 group-hover:to-purple-400 transition-all duration-300">
                        HASHIRA
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-8">
                    <nav className="flex items-center gap-6">
                        <Link to="/anime" className="text-gray-300 hover:text-purple-400 transition-colors duration-300 font-medium">
                            Anime
                        </Link>
                        <Link to="/manga" className="text-gray-300 hover:text-pink-400 transition-colors duration-300 font-medium">
                            Manga
                        </Link>
                        <Link to="/news" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 font-medium">
                            Yangiliklar
                        </Link>
                        <Link to="/forum" className="text-gray-300 hover:text-yellow-400 transition-colors duration-300 font-medium">
                            Forum
                        </Link>
                    </nav>
                </div>

                {/* Search and Actions */}
                <div className="flex items-center gap-4">
                    {/* Search Bar */}
                    <div ref={searchContainerRef} className="relative hidden sm:block">
                        <input
                            ref={inputRef}
                            type="search"
                            placeholder="Tezkor qidiruv..."
                            value={searchQuery}
                            onChange={handleInputChange}
                            onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
                            className="w-64 py-2.5 pl-5 pr-12 rounded-xl border border-zinc-600/50 bg-zinc-800/50 backdrop-blur-sm text-white placeholder:text-gray-400 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                            style={{
                                background: 'linear-gradient(145deg, rgba(39, 39, 42, 0.8), rgba(24, 24, 27, 0.9))',
                                boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                            }}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400">
                            {isSearching ? (
                                <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            )}
                        </div>

                        {/* Search Dropdown */}
                        {showDropdown && searchResults.length > 0 && (
                            <div
                                ref={dropdownRef}
                                className="absolute top-full left-0 right-0 mt-2 bg-zinc-800/95 backdrop-blur-lg border border-zinc-600/50 rounded-xl shadow-2xl max-h-80 overflow-y-auto z-50"
                                style={{
                                    background: 'linear-gradient(145deg, rgba(39, 39, 42, 0.95), rgba(24, 24, 27, 0.95))',
                                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                                }}
                            >
                                {searchResults.map((anime) => (
                                    <div
                                        key={anime.mal_id}
                                        onClick={() => handleAnimeSelect(anime)}
                                        className="flex items-center gap-3 p-3 hover:bg-purple-500/10 transition-colors duration-200 cursor-pointer border-b border-zinc-700/30 last:border-b-0"
                                    >
                                        <img
                                            src={anime.images.jpg.image_url}
                                            alt={anime.title}
                                            className="w-12 h-16 object-cover rounded-lg flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-white font-medium text-sm truncate">
                                                {anime.title_english || anime.title}
                                            </h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                {anime.score && (
                                                    <div className="flex items-center gap-1">
                                                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                        <span className="text-yellow-400 text-sm font-medium">
                                                            {anime.score}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Filter Button */}
                    <Link
                        to="/search"
                        className="p-2.5 rounded-xl bg-zinc-800/50 backdrop-blur-sm border border-zinc-600/50 text-gray-300 hover:text-purple-400 hover:border-purple-500/50 transition-all duration-300 shadow-lg"
                        style={{
                            background: 'linear-gradient(145deg, rgba(39, 39, 42, 0.8), rgba(24, 24, 27, 0.9))',
                            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                        }}
                    >
                        <FontAwesomeIcon icon={faSliders} className="w-4 h-4" />
                    </Link>

                    {/* Login Button */}
                    <button
                        type="button"
                        className="cursor-pointer hidden sm:block px-6 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 border border-purple-500/50 shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
                    >
                        Kirish
                    </button>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden p-2.5 rounded-xl bg-zinc-800/50 backdrop-blur-sm border border-zinc-600/50 text-gray-300 hover:text-purple-400 transition-all duration-300"
                        style={{
                            background: 'linear-gradient(145deg, rgba(39, 39, 42, 0.8), rgba(24, 24, 27, 0.9))',
                        }}
                    >
                        <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`lg:hidden transition-all duration-300 ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                <div className="px-4 py-4 border-t border-zinc-700/50" style={{
                    background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(24, 24, 27, 0.95))',
                    backdropFilter: "blur(20px)"
                }}>
                    {/* Mobile Search */}
                    <div className="relative mb-4 sm:hidden">
                        <input
                            type="search"
                            placeholder="Tezkor qidiruv..."
                            className="w-full py-2.5 pl-5 pr-12 rounded-xl border border-zinc-600/50 bg-zinc-800/50 backdrop-blur-sm text-white placeholder:text-gray-400 focus:outline-none focus:border-purple-500/50 transition-all duration-300"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    <nav className="flex flex-col gap-3 mb-4">
                        <Link to="/anime" className="text-gray-300 hover:text-purple-400 transition-colors duration-300 font-medium py-2">
                            Anime
                        </Link>
                        <Link to="/manga" className="text-gray-300 hover:text-pink-400 transition-colors duration-300 font-medium py-2">
                            Manga
                        </Link>
                        <Link to="/news" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 font-medium py-2">
                            Yangiliklar
                        </Link>
                        <Link to="/forum" className="text-gray-300 hover:text-yellow-400 transition-colors duration-300 font-medium py-2">
                            Forum
                        </Link>
                    </nav>

                    {/* Mobile Login */}
                    <button
                        type="button"
                        className="cursor-pointer w-full px-6 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 border border-purple-500/50 shadow-lg transition-all duration-300"
                    >
                        Kirish
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;