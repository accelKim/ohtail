import React, { useEffect, useState } from 'react';
import RecipeCard from './RecipeCard'; 
import style from '../../styles/recipe/RecipeList.module.css';

const MainPageRacipe = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecipes = async () => {
            setLoading(true);
            try {
                const promises = Array.from({ length: 4 }, () =>
                    fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php')
                        .then(response => response.json())
                        .then(data => data.drinks[0])
                );
                const results = await Promise.all(promises);
                setRecipes(results);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className={style.results}>
            {recipes.map((recipe) => (
                <RecipeCard key={recipe.idDrink} recipe={recipe} />
            ))}
        </div>
    );
};

export default MainPageRacipe;
