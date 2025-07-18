import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Trophy, ChartBarStacked, LibraryBig } from 'lucide-react';
import { Settings2 } from "lucide-react";
import './siteHeader.css';
import type { AnimeSearchResult } from "../../types/anime";
import RandomAnimeButton from "./RandomAnimeButton";

const fetchSearchedAnime = async (animeName: string): Promise<AnimeSearchResult[]> => {
    const url = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(animeName)}&limit=8`;
    const response = await fetch(url);
    const data = await response.json();
    return data.data || [];
};

const SiteHeader = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [mobileSearchQuery, setMobileSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<AnimeSearchResult[]>([]);
    const [mobileSearchResults, setMobileSearchResults] = useState<AnimeSearchResult[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showMobileDropdown, setShowMobileDropdown] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [isMobileSearching, setIsMobileSearching] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);
    const mobileInputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const mobileDropdownRef = useRef<HTMLDivElement>(null);
    const searchContainerRef = useRef<HTMLDivElement>(null);
    const mobileSearchContainerRef = useRef<HTMLDivElement>(null);
    const [showHeader, setShowHeader] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const menuItems = [
        {
          id: 'home',
          icon: '🏠',
          label: 'Главная',
          path: '/'
        },
        {
          id: 'leaderboard',
          icon: <Trophy />,
          label: 'Лидерборд',
          path: '/leaderboard'
        },
        {
          id: 'categories',
          icon: <ChartBarStacked />,
          label: 'Категории',
          path: '/categories'
        },
        {
          id: 'collection',
          icon: <LibraryBig />,
          label: 'Моя коллекция',
          path: '/collection'
        }
      ];

    useEffect(() => {
        const handleScroll = () => {
          const currentScrollY = window.scrollY;
    
          if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // Pastga scroll — yashir
            setShowHeader(false);
          } else {
            // Tepaga scroll — ko'rsat
            setShowHeader(true);
          }
    
          setLastScrollY(currentScrollY);
        };
    
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
      }, [lastScrollY]);

    useEffect(() => {
        // Focus the search input when the component mounts
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    // Debounce search for desktop
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

    // Debounce search for mobile
    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (mobileSearchQuery.trim()) {
                setIsMobileSearching(true);
                try {
                    const results = await fetchSearchedAnime(mobileSearchQuery);
                    setMobileSearchResults(results);
                    setShowMobileDropdown(true);
                } catch (error) {
                    console.error("Ошибка поиска:", error);
                    setMobileSearchResults([]);
                } finally {
                    setIsMobileSearching(false);
                }
            } else {
                setMobileSearchResults([]);
                setShowMobileDropdown(false);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [mobileSearchQuery]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchContainerRef.current &&
                !searchContainerRef.current.contains(event.target as Node)
            ) {
                setShowDropdown(false);
            }
            if (
                mobileSearchContainerRef.current &&
                !mobileSearchContainerRef.current.contains(event.target as Node)
            ) {
                setShowMobileDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Blur on scroll
    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleMobileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMobileSearchQuery(e.target.value);
    };

    const handleAnimeSelect = (anime: AnimeSearchResult) => {
        setShowDropdown(false);
        setSearchQuery("");
        navigate(`/anime/${anime.mal_id}`);
    };

    const handleMobileAnimeSelect = (anime: AnimeSearchResult) => {
        setShowMobileDropdown(false);
        setMobileSearchQuery("");
        setMobileMenuOpen(false);
        navigate(`/anime/${anime.mal_id}`);
    };
    
    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-12 py-5 sm:py-6 transition-all duration-400 flex flex-col backdrop-blur-lg ${showHeader ? 'translate-y-0' : '-translate-y-full'}
                `}
            style={{
                backdropFilter: scrolled ? 'blur(24px)' : 'blur(0)',
                background: 'linear-gradient(180deg,#000c,#0000)'
            }}
        >
            <div className="relative z-10 flex items-center justify-between">
                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-3 group relative select-none transition-transform duration-300 hover:scale-90"
                >
                    <img
                        src="/logos/hashira-440x130.png"
                        alt="site logo"
                        className="w-[171px] h-[50x] object-contain rounded-full"
                        />
                </Link>

                {/* Search and Actions - Hidden on tablet and mobile */}
                <div className="hidden xl:flex items-center gap-4">
                    {/* Search Bar */}
                    <div ref={searchContainerRef} className="flex items-center relative gap-2 w-full max-w-md">
                        <input
                            ref={inputRef}
                            type="search"
                            placeholder="Tezkor qidiruv..."
                            value={searchQuery}
                            onChange={handleInputChange}
                            onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
                            className="w-full lg:w-134 py-2.5 pl-5 pr-12 rounded-xl border border-zinc-600/50 bg-(--bg-color) backdrop-blur-sm text-white placeholder:text-gray-400 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                            style={{
                                background: 'var(--button-bg-color)',
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
                        className="p-1.5 rounded-xl block"
                    >
                        <Settings2 className="w-6 h-6"
                            style={{ color: 'var(--text-color)' }}    
                        />
                    </Link>
                </div>


                {/* Right side buttons */}
                <div className="flex items-center gap-4">
                <RandomAnimeButton />
                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden cursor-pointer p-2.5 rounded-xl bg-zinc-800/50 backdrop-blur-sm border border-zinc-600/50 text-gray-300 hover:text-purple-400 transition-all duration-300"
                        style={{
                            background: 'linear-gradient(145deg, rgba(39, 39, 42, 0.8), rgba(24, 24, 27, 0.9))',
                        }}
                    >
                        <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} className="w-5 h-5" />
                    </button>

                    {/* Login Button */}
                    <button
                        type="button"
                        className="cursor-pointer lg:block hidden px-6 py-2.5 rounded-xl font-semibold text-white bg-(--button-bg-color) transition-all duration-300 transform hover:scale-105"
                    >
                        Kirish
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`lg:hidden transition-all rounded-xl duration-300 ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-4 py-4 border-t border-zinc-700/50" style={{
                    background: 'linear-gradient(145deg, rgba(39, 39, 42, 0.8), rgba(24, 24, 27, 0.9))',
                    backdropFilter: "blur(20px)",
                    borderRadius: '20px',
                }}>
                    {/* Mobile Search */}
                    <div ref={mobileSearchContainerRef} className="relative mb-4">
                        <input
                            ref={mobileInputRef}
                            type="search"
                            placeholder="Tezkor qidiruv..."
                            value={mobileSearchQuery}
                            onChange={handleMobileInputChange}
                            onFocus={() => mobileSearchResults.length > 0 && setShowMobileDropdown(true)}
                            className="w-full py-2.5 pl-5 pr-12 rounded-xl border border-zinc-600/50 bg-zinc-800/50 backdrop-blur-sm text-white placeholder:text-gray-400 focus:outline-none focus:border-purple-500/50 transition-all duration-300"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400">
                            {isMobileSearching ? (
                                <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            )}
                        </div>

                        {/* Mobile Search Dropdown */}
                        {showMobileDropdown && mobileSearchResults.length > 0 && (
                            <div
                                ref={mobileDropdownRef}
                                className="absolute top-full left-0 right-0 mt-2 bg-zinc-800/95 backdrop-blur-lg border border-zinc-600/50 rounded-xl shadow-2xl max-h-80 overflow-y-auto z-500"
                                style={{
                                    background: 'linear-gradient(145deg, rgba(39, 39, 42, 0.95), rgba(24, 24, 27, 0.95))',
                                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                                }}
                            >
                                {mobileSearchResults.map((anime) => (
                                    <div
                                        key={anime.mal_id}
                                        onClick={() => handleMobileAnimeSelect(anime)}
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
                    {/* Mobile Menu Items */}
                    {/* Main Menu */}
                    <nav className="pb-4">
                        <div className="space-y-2 p-2">
                        {menuItems.map((item) => (
                            <Link
                            key={item.id}
                            to={item.path}
                            className={`flex items-center bg-(--grey-color) space-x-3 px-1 py-3 rounded-pill  transition-all duration-200 ease-in-out mb-2 hover:bg-zinc-800/50 hover:text-white hover:scale-105 cursor-pointer font-semibold ${item.icon && 'justify-center'} ${
                                location.pathname === item.path
                                ? 'bg(--grey-color) border border-purple-500/30 text-purple-300'
                                : 'text-zinc-300 hover:bg-zinc-800/50 hover:text-white'
                                }`}
                            style={{
                                backgroundColor: 'var(--grey-color)',
                                borderRadius: '20px' }}
                            >
                            <span className="text-lg">{item.icon}</span>
                            <span className="font-medium">{item.label}</span>
                            </Link>
                        ))}
                        </div>
                    </nav>
                    <div className="flex items-center justify-between gap-4">
                        {/* Mobile Filter Button */}
                        <div className="max-w-[200px]">
                            <Link
                                to="/search"
                                className="flex items-center gap-2 p-3 rounded-xl bg-zinc-800/50 backdrop-blur-sm border border-zinc-600/50 text-gray-300 hover:text-purple-400 transition-all duration-300"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <Settings2 className="w-5 h-5" />
                                <span>Qo'shimcha filtrlash</span>
                            </Link>
                        </div>

                        {/* Mobile Login */}
                        <button
                            type="button"
                            className="cursor-pointer hidden sm:block px-6 py-2.5 rounded-xl font-semibold text-white bg-(--button-bg-color) transition-all duration-300 transform hover:scale-105"
                        >
                            Kirish
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default SiteHeader;