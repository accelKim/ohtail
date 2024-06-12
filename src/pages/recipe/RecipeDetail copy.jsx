import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import style from '../../styles/recipe/RecipeDetail.module.css';

const RecipeDetail = () => {
    const { id } = useParams();
    const [cocktail, setCocktail] = useState(null);
    const [translatedInstructions, setTranslatedInstructions] = useState('');
    const [translatedIngredients, setTranslatedIngredients] = useState([]);

    useEffect(() => {
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`)
            .then((response) => response.json())
            .then((data) => {
                setCocktail(data.drinks[0]);
                return data.drinks[0];
            })
            .then((cocktail) => {
                translateText(cocktail.strInstructions, setTranslatedInstructions);
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

                Promise.all(ingredients.map(async (item) => {
                    const translatedIngredient = await translateText(item.ingredient);
                    return { ...item, translatedIngredient };
                })).then(translated => setTranslatedIngredients(translated));
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, [id]);

    const translateText = async (text, setState) => {
        const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=AIzaSyAhwZLdPEn3-pjnH2GTrE2UViZ-LpWUN-o`, { // YOUR_API_KEY를 실제 API 키로 변경
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify({
                q: text,
                source: 'en',
                target: 'ko',
                format: 'text'
            }),
        });
        const data = await response.json();
        if (setState) {
            setState(data.data.translations[0].translatedText);
        }
        return data.data.translations[0].translatedText;
    };

    if (!cocktail) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{cocktail.strDrink}</h1>
            <img src={cocktail.strDrinkThumb} alt={cocktail.strDrink} />
            <p>{translatedInstructions}</p>
            <ul>
                {translatedIngredients.map((item, index) => (
                    <li key={index}>
                        {item.measure} {item.translatedIngredient ? item.translatedIngredient : item.ingredient}
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
