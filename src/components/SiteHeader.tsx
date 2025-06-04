import { Link } from "react-router-dom";
import { useRef } from "react";
import { useSearchStore } from "../store/searchStore";
const Header = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const setQuery = useSearchStore((state) => state.setQuery);

    const handleSearch = () => {
        const value = inputRef.current?.value;
        if (value) {
            setQuery(value);
        }
    }

    return (
        <header className="bg-white shadow-md py-4 px-6 flex items-center justify-between sticky top-0 z-50">
            <Link to="/" className="text-2xl font-bold text-blue-600">
                <span className='flex items-center gap-3'>
                    <img className="bg-lime-100 rounded-full" src="/public/logo-3.png" alt="Hashira website logo" width={64} height={64} srcSet="" />
                    <span className="text-lime-600 text-4xl">Hashira</span>
                </span>
            </Link>
            <nav className="space-x-4 text-sm sm:text-base">
                <Link to="/anime" className="text-gray-700 hover:text-blue-500">Anime</Link>
                <Link to="/manga" className="text-gray-700 hover:text-blue-500">Manga</Link>
                <Link to="/yangiliklar" className="text-gray-700 hover:text-blue-500">Yangiliklar</Link>
                <Link to="/forum" className="text-gray-700 hover:text-blue-500">Forum</Link>
                <Link to="/market" className="text-gray-700 hover:text-blue-500">Market</Link>
            </nav>
            <label htmlFor="searchInput">
                <input ref={inputRef}
                    type="search"
                    placeholder="Anime qidirish..."
                    onChange={handleSearch}
                />
            </label>
            <button type='button'>Kirish</button>
        </header>
    )
}
export default Header;