import React, { useEffect, useState } from "react";
import MyRecipeCard from "../../../components/myRecipe/MyRecipeCard";
import RecipeCard from "../../../components/recipe/RecipeCard";

const FavoritesTab = () => {
  const [allRecipes, setAllRecipes] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8080/favorites", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log("Fetched favorites:", data);

        // 나만의 레시피와 공식 레시피 데이터를 가져오는 프로미스 배열 생성
        const recipePromises = data.map((favorite) => {
          if (favorite.isExternal) {
            return fetch(
              `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${favorite.cocktailId}`
            )
              .then((res) => res.json())
              .then((res) => ({ ...res.drinks[0], isExternal: true }));
          } else {
            return fetch(
              `http://localhost:8080/myRecipe/${favorite.cocktailId}`
            ).then((res) => res.json());
          }
        });

        // 데이터를 가져옴
        const recipeData = await Promise.all(recipePromises);

        // 가져온 데이터를 상태에 저장
        setAllRecipes(recipeData);
      } catch (error) {
        console.error("오류 발생!!!!!", error);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <div>
      <h2>즐겨찾기한 레시피</h2>
      <ul>
        {allRecipes.length > 0 ? (
          allRecipes.map((recipe) =>
            recipe.isExternal ? (
              <RecipeCard key={recipe.idDrink} recipe={recipe} />
            ) : (
              <MyRecipeCard key={recipe._id} myRecipe={recipe} />
            )
          )
        ) : (
          <p>즐겨찾기한 레시피를 찾을 수 없어요!!!</p>
        )}
      </ul>
    </div>
  );
};

export default FavoritesTab;
