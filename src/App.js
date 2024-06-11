import './styles/reset.css';
import './styles/style.css';

import Header from './layouts/Header';
import Footer from './layouts/Footer';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from './pages/main/Main';
import Recipe from './pages/recipe/RecipeList';
import RecipeDetail from './pages/recipe/RecipeDetail';

function App() {
    return (
        <BrowserRouter>
            <div className="wrap">
                <Header />
                <Routes>
                    <Route path="/" element={<Main />} />
                    
                    {/* 레시피 페이지 */}
                    <Route path="/recipe" element={<Recipe />} />
                    <Route path="/cocktail/:id" element={<RecipeDetail />} />
                </Routes>
                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default App;
