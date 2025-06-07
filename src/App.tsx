import './App.css';
import Header from './components/SiteHeader';
import HomePage from './pages/HomePage/HomePage';
import { Route, Routes } from 'react-router-dom';
import Search from './components/Search';
import AnimeDetailPage from './pages/AnimeDetail/AnimeDetailPage';

function App() {
  return (
      <div className="min-h-screen bg-slate-900">
      <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path='/search' element={<Search />}></Route>
          <Route path="/anime/:id" element={<AnimeDetailPage />} />
          <Route path="/anime" element={<div>Anime List Page</div>} />
          <Route path="/manga" element={<div>Manga Page</div>} />
          <Route path="/news" element={<div>News Page</div>} />
          <Route path="/forum" element={<div>Forum Page</div>} />
          <Route path="/search" element={<div>Search Page</div>} />
        </Routes>
      </div>
  );
}

export default App;