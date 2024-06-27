import React from "react";
import { useNavigate } from "react-router-dom";

const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/recipe/${recipe.idDrink}`);
  };

  return (
    <li onClick={handleCardClick}>
      <article>
        <figure>
          <img src={recipe.strDrinkThumb} alt={recipe.strDrink} />
          <figcaption>
            <h3>{recipe.strDrink}</h3>
          </figcaption>
        </figure>
      </article>
    </li>
  );
};

export default RecipeCard;
