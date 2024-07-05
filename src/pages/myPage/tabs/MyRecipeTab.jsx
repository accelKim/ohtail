import React, { useEffect, useState } from "react";
import MyRecipeCard from "../../../components/myRecipe/MyRecipeCard";
import style from "../../../styles/myPage/RecipesTab.module.css";

const MyRecipeTab = () => {
  const [myPageRecipes, setMyPageRecipes] = useState([]);

  useEffect(() => {
    const fetchMyPageRecipes = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8080/myRecipeTab", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("레시피 불러오기 실패!!!!!");
        }
        const data = await response.json();
        console.log("불러온 레시피 데이터:", data); // 로그 추가
        setMyPageRecipes(data);
      } catch (error) {
        console.error("오류발생!!!!!", error);
      }
    };

    fetchMyPageRecipes();
  }, []);

  return (
    <div className="mw">
      <ul className={style.gridContainer}>
        {myPageRecipes.map((myRecipe) => (
          <MyRecipeCard key={myRecipe._id} myRecipe={myRecipe} />
        ))}
      </ul>
    </div>
  );
};

export default MyRecipeTab;
