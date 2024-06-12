import "./styles/reset.css";
import "./styles/style.css";

import Header from "./layouts/Header";
import Footer from "./layouts/Footer";




import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./pages/main/Main";
import CreateMyRecipe from "./pages/myRecipe/CreateMyRecipe";
import Webzine from './pages/webzine/Webzine';

function App() {
  return (
    <BrowserRouter>
      <div className="wrap">
        <Header />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/webzine" element={<Webzine />} />
          <Route path="/createMyRecipe" element={<CreateMyRecipe />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
