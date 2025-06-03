import { Link } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
const Header = () => {
    return (
        <header className="bg-white shadow-md py-4 px-6 flex items-center justify-between sticky top-0 z-50">
            <Link to="/" className="text-2xl font-bold text-blue-600">
                Hashira
            </Link>
            <nav className="space-x-4 text-sm sm:text-base">
                <Link to="/anime" className="text-gray-700 hover:text-blue-500">Аниме</Link>
                <Link to="/manga" className="text-gray-700 hover:text-blue-500">Манга</Link>
                <Link to="/news" className="text-gray-700 hover:text-blue-500">Новости</Link>
                <Link to="/forum" className="text-gray-700 hover:text-blue-500">Форум</Link>
                <Link to="/shop" className="text-gray-700 hover:text-blue-500">Маркет</Link>
            </nav>
        </header>
    )
}
export default Header;