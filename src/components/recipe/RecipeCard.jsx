import React from "react";
import { useNavigate } from "react-router-dom";
import style from '../../styles/recipe/RecipeList.module.css'
const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/recipe/${recipe.idDrink}`);
  };

  return (
    <li onClick={handleCardClick} className={style.recipe_card}>
        <figure>
          <img src={recipe.strDrinkThumb} alt={recipe.strDrink} />
          <figcaption>
            <p>{recipe.strDrink}</p>
          </figcaption>
        </figure>
    </li>
  );
};

export default RecipeCard;
