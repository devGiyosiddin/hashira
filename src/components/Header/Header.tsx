import React from 'react';
import { Search, Crown, } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 p-4 bg-gradient-to-b from-slate-900/80 to-transparent backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold text-white">
          animix
        </div>

        {/* Search Bar */}
        <div className="relative flex-grow mx-8 max-w-lg">
          <input
            type="text"
            placeholder="Быстрый поиск"
            className="w-full py-2 pl-10 pr-4 rounded-full bg-slate-800/70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-slate-700"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>

        {/* Right Section - Premium & Login */}
        <div className="flex items-center space-x-4">
          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors duration-300">
            <Crown className="w-5 h-5" />
            Премиум
          </button>
          <button className="px-4 py-2 rounded-full border border-gray-600 hover:bg-gray-700 text-white font-semibold transition-colors duration-300">
            Войти
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
