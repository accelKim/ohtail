import './styles/reset.css';
import './styles/style.css';

import Header from './components/Header';
import Footer from './components/Footer';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from './pages/main/Main';

function App() {
  return (
    <BrowserRouter>
      <div className="wrap">
        <Header />
        <Routes>
          <Route path="/" element={<Main />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
