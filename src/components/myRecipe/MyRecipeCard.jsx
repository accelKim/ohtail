import React from "react";
import { useNavigate } from "react-router-dom";

const MyRecipeCard = ({ myRecipe }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/myRecipe/${myRecipe._id}`);
  };

  return (
    <li onClick={handleClick}>
      <img
        src={`http://localhost:8080/uploads/${myRecipe.files[0]}`} // 등록한 이미지 중 첫번째 이미지만 출력
        alt={"레시피 이미지"}
      />
      <h3>{myRecipe.title}</h3>
    </li>
  );
};

export default MyRecipeCard;
