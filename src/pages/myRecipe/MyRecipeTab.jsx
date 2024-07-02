// 추후 마이페이지 관련 폴더로 이동

import React, { useEffect, useState } from "react";
import MyRecipeCard from "../../components/myRecipe/MyRecipeCard";

const MyRecipeTab = () => {
  const [myRecipes, setMyRecipes] = useState([]);

  useEffect(() => {
    const fetchMyRecipes = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8080/myRecipe", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("레시피 불러오기 실패!!!!!");
        }
        const data = await response.json();
        setMyRecipes(data);
      } catch (error) {
        console.error("오류발생!!!!!", error);
      }
    };

    fetchMyRecipes();
  }, []);

  return (
    <div>
      <h2>내가 작성한 레시피</h2>
      <ul>
        {myRecipes.map((recipe) => (
          <MyRecipeCard key={recipe._id} myRecipe={recipe} />
        ))}
      </ul>
    </div>
  );
};

export default MyRecipeTab;
