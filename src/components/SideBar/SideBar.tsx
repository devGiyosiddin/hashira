import { Link, useLocation } from 'react-router-dom';
import { Trophy, ChartBarStacked, LibraryBig } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
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

  const socialItems = [
    {
      id: 'telegram',
      icon: '📱',
      label: 'Мы в Telegram',
      path: '/telegram',
      external: true
    }
  ];

  return (
    <aside className="sticky top-[100px] h-fit-content bg-(--bg-color) w-64 flex flex-col z-40 overflow-hidden lg:flex hidden"
    style={{
      'height': 'fit-content',
    }}
    >
      {/* Main Menu */}
      <nav className="pb-4">
        <div className="space-y-2">
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

      {/* TODO:Realize friends section */}
      {/* Друзья в сети */}
      <div className="px-4 py-4 border-t border-zinc-700/50">
        <h3 className="text-zinc-400 text-sm font-semibold mb-3">Друзья в сети</h3>
        <div className="text-center text-zinc-500 text-sm py-4">
          Друзей в сети пока что нет
        </div>
      </div>
      
      {/* TODO:Realize theme section */}
      {/* Тема сайта */}
      <div className="px-4 py-4 border-t border-zinc-700/50">
        <h3 className="text-zinc-400 text-sm font-semibold mb-3">Тема сайта</h3>
        <select className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-3 py-2 text-white text-sm">
          <option value="default">По умолчанию</option>
          <option value="dark">Темная</option>
          <option value="light">Светлая</option>
        </select>
      </div>

      {/* Хостинг */}
      {/* <div className="px-4 py-4 border-t border-zinc-700/50">
        <h3 className="text-zinc-400 text-sm font-semibold mb-3">ХОСТИНГ ПРЕДОСТАВЛЕН</h3>
        <div className="flex items-center space-x-2 bg-blue-600/20 rounded-lg p-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">C</span>
          </div>
          <span className="text-blue-300 font-medium">cloud</span>
        </div>
      </div> */}

      {/* Social Links */}
      <div className="px-4 py-4 border-t border-zinc-700/50">
        <div className="space-y-2">
          {socialItems.map((item) => (
            <a
              key={item.id}
              href={item.external ? '#' : item.path}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-zinc-300 hover:bg-zinc-800/50 hover:text-white transition-all duration-200"
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Bottom Links */}
      <div className="px-4 py-4 border-t border-zinc-700/50 space-y-2 text-xs">
        <Link to="/contacts" className="block text-zinc-400 hover:text-white transition-colors">
          Kontaktlar
        </Link>
        <Link to="/rules" className="block text-zinc-400 hover:text-white transition-colors">
          Platforma qoidalari
        </Link>
        <Link to="/owners" className="block text-zinc-400 hover:text-white transition-colors">
          Mualliflik huquqi
        </Link>
        <Link to="/privacy" className="block text-zinc-400 hover:text-white transition-colors">
          Maxfiylik siyosati
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;