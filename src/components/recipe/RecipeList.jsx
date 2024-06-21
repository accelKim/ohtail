import React from 'react';
import { Link } from 'react-router-dom';
import style from '../../styles/recipe/RecipeList.module.css';

const RecipeList = ({ searchResults, hasSearched }) => {
    return (
        hasSearched ? (
            searchResults.length > 0 ? (
                <div className={style.results}>
                    {searchResults.map((recipe) => (
                        <div key={recipe.idDrink} className={style.recipe_card}>
                            <p>{recipe.strDrink}</p>
                            <Link to={`/recipe/${recipe.idDrink}`}></Link>
                            <img src={recipe.strDrinkThumb} alt={recipe.strDrink} width="100" />
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    검색결과가 없습니다
                </div>
            )
        ) : null
    );
};

export default RecipeList;
