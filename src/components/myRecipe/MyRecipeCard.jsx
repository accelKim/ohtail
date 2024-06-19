import React from "react";
import { useNavigate } from "react-router-dom";

const MyRecipeCard = ({ myRecipe }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/myRecipe/${myRecipe._id}`);
  };

  return (
    <li onClick={handleCardClick}>
      <div>
        {myRecipe.files && myRecipe.files.length > 0 && (
          <img
            src={`http://localhost:8080/${myRecipe.files[0]}`}
            alt={myRecipe.title}
          />
        )}
      </div>
      <h3>칵테일 제목: {myRecipe.title}</h3>
      <p>작성자: {myRecipe.author}</p>
    </li>
  );
};

export default MyRecipeCard;
