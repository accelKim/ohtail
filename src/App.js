import "./styles/reset.css";
import "./styles/style.css";

import Header from "./layouts/Header";
import Footer from "./layouts/Footer";

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from './pages/main/Main';
import Recipe from './pages/recipe/RecipeList';
import RecipeDetail from './pages/recipe/RecipeDetail';
import CreateMyRecipe from "./pages/myRecipe/CreateMyRecipe";

function App() {
    return (
        <BrowserRouter>
            <div className="wrap">
                <Header />
                <Routes>
                    <Route path="/" element={<Main />} />
                    
                    {/* 레시피 페이지 */}
                    <Route path="/recipe" element={<Recipe />} />
                    <Route path="/recipe/:id" element={<RecipeDetail />} />
                    {/* 마이 레시피 */}
                    <Route path="/createMyRecipe" element={<CreateMyRecipe />} />
                </Routes>
                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default App;
