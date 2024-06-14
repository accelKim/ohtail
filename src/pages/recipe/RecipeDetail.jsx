import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import style from '../../styles/recipe/RecipeDetail.module.css'

const RecipeDetail = () => {
    const { id } = useParams();
    const [cocktail, setCocktail] = useState(null);

    useEffect(() => {
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`)
            .then((response) => response.json())
            .then((data) => {
                setCocktail(data.drinks[0]);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, [id]);

    if (!cocktail) {
        return <div>Loading...</div>;
    }
    const ingredients = Object.keys(cocktail)
        .filter((key) => key.startsWith('strIngredient') && cocktail[key])
        .map((key) => {
            const index = key.replace('strIngredient', '');
            const measure = cocktail[`strMeasure${index}`];
            return {
                ingredient: cocktail[key],
                measure: measure || 'to taste',
            };
        });
    return (
        <div>
            <h1>{cocktail.strDrink}</h1>
            <img src={cocktail.strDrinkThumb} alt={cocktail.strDrink} />
            <p>{cocktail.strInstructions}</p>
            <ul>
                {ingredients.map((item, index) => (
                    <li key={index}>
                        {item.measure} {item.ingredient}
                        <img
                            src={`https://www.thecocktaildb.com/images/ingredients/${item.ingredient}-Small.png`}
                            alt={item.ingredient}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecipeDetail;
