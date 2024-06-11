import './styles/reset.css';
import './styles/style.css';

import Header from './layouts/Header';
import Footer from './layouts/Footer';

import Main from './pages/main/Main';
import Webzine from './pages/webzine/Webzine';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="wrap">
        <Header />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/webzine" element={<Webzine />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
