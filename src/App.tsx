import './App.css';
import SiteHeader from './components/Header/SiteHeader';
import HomePage from './pages/HomePage/HomePage';
import { Route, Routes } from 'react-router-dom';
import Search from './components/Search/Search';
import AnimeDetailPage from './pages/AnimeDetail/AnimeDetailPage';
import AllAnime from './pages/All/Allanime';
import WatchPage from './pages/watch';

function App() {
  return (
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 pt-[100px]">
      <SiteHeader />
        {/* Main content area */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path='/search' element={<Search />}></Route>
          <Route path="/anime/:id" element={<AnimeDetailPage />} />
          <Route path="/anime" element={<div>Anime List Page</div>} />
          <Route path="/manga" element={<div>Manga Page</div>} />
          <Route path="/news" element={<div>News Page</div>} />
          <Route path="/forum" element={<div>Forum Page</div>} />
          <Route path="/search" element={<div>Search Page</div>} />
          <Route path="/all" element={<AllAnime />} />
          <Route path="/watch/:animeId/:episodeNumber" element={<WatchPage />} />
        </Routes>
    </div>
    
    // TODO: Add Footer component
    // <Footer />

    // TODO: Add Leaderboard, Categories, Collection pages
  );
}

export default App;