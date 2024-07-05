import React from "react";
import { useNavigate } from "react-router-dom";
import style from "../../styles/recipe/RecipeCard.module.css";
const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/recipe/${recipe.idDrink}`);
  };

  return (
    <li onClick={handleCardClick}>
      <figure className={style.imgCon}>
        <img src={recipe.strDrinkThumb} alt={recipe.strDrink} />
        <figcaption className={style.imgText}>
          <h3>{recipe.strDrink}</h3>
        </figcaption>
      </figure>
    </li>
  );
};

export default RecipeCard;
