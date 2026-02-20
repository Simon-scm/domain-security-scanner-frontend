import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Scan from './pages/Scan';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scan/:id" element={<Scan />} />
      </Routes>
    </BrowserRouter>
  );
}

