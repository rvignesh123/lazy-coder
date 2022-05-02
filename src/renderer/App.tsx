import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import Terminals from './components/Terminals';
import Configurations from './components/Configurations';
import LazyContextProvider from './context/LazyContextProvider';
import './App.css';

export default function App() {
  return (
    <Router>
      <Header />
      <LazyContextProvider>
        <Routes>
          <Route path="/" element={<Terminals />} />
          <Route path="/config" element={<Configurations />} />
        </Routes>
      </LazyContextProvider>
    </Router>
  );
}
