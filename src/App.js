import './styles/reset.css';
import './styles/style.css';

import Header from './layouts/Header';
import Footer from './layouts/Footer';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from './pages/main/Main';

import RecipeDetail from './pages/recipe/RecipeDetail';
import CreateMyRecipe from './pages/myRecipe/CreateMyRecipe';
import Webzine from './pages/webzine/Webzine';
import Login from './pages/login/Login';
<<<<<<< HEAD
import Signup from './pages/signup/Signup';
=======
import Singup from './pages/singup/Singup';
import RecipeListPage from './pages/recipe/RecipeListPage';
>>>>>>> 3d2151461c3df370a676584453d17225bbba1f65

function App() {
  return (
    <BrowserRouter>
      <div className="wrap">
        <Header />
        <Routes>
          <Route path="/" element={<Main />} />
          {/* 레시피 페이지 */}
          <Route path="/recipe" element={<RecipeListPage />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          {/* 마이 레시피 */}
          <Route path="/createMyRecipe" element={<CreateMyRecipe />} />
          {/* 웹진 */}
          <Route path="/webzine" element={<Webzine />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
