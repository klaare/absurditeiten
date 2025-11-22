import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { HomePage } from './pages/HomePage';
import { TongbrekersPage } from './pages/TongbrekersPage';
import { CondoleancesPage } from './pages/CondoleancesPage';
import { SpreukenPage } from './pages/SpreukenPage';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tongbrekers" element={<TongbrekersPage />} />
        <Route path="/condoleances" element={<CondoleancesPage />} />
        <Route path="/spreuken" element={<SpreukenPage />} />
      </Routes>
    </Router>
  );
}

export default App;
