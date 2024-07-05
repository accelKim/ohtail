import React, { useEffect, useState } from "react";
import MyRecipeCard from "../../../components/myRecipe/MyRecipeCard";
import RecipeCard from "../../../components/recipe/RecipeCard";
import style from "../../../styles/myPage/RecipesTab.module.css";

const FavoritesTab = () => {
  const [allRecipes, setAllRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8080/favorites", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch favorites");
        }

        const data = await response.json();
        console.log("Fetched favorites:", data);

        const recipePromises = data
          .filter((favorite) => favorite !== null) // null 값 필터링
          .map((favorite) =>
            favorite.isExternal
              ? fetchExternalRecipe(favorite.cocktailId)
              : fetchInternalRecipe(favorite.cocktailId)
          );

        const recipeData = await Promise.all(recipePromises);
        setAllRecipes(recipeData);
      } catch (error) {
        console.error("Error occurred:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchExternalRecipe = async (cocktailId) => {
      try {
        const response = await fetch(
          `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${cocktailId}`
        );
        if (!response.ok) {
          throw new Error(
            `Failed to fetch external recipe for ID: ${cocktailId}`
          );
        }
        const res = await response.json();
        return { ...res.drinks[0], isExternal: true };
      } catch (error) {
        console.error("Error fetching external recipe:", error);
        return null; // 에러 발생 시 null 반환
      }
    };

    const fetchInternalRecipe = async (cocktailId) => {
      try {
        const response = await fetch(
          `http://localhost:8080/myRecipe/${cocktailId}`
        );
        if (!response.ok) {
          throw new Error(
            `Failed to fetch internal recipe for ID: ${cocktailId}`
          );
        }
        return await response.json();
      } catch (error) {
        console.error("Error fetching internal recipe:", error);
        return null; // 에러 발생 시 null 반환
      }
    };

    fetchFavorites();
  }, []);

  if (loading) {
    return <p>로딩 중...</p>;
  }

  if (error) {
    return <p>에러 발생: {error}</p>;
  }

  return (
    <div className="mw">
      <ul className={style.gridContainer}>
        {allRecipes.length > 0 ? (
          allRecipes
            .filter((recipe) => recipe !== null) // null 값 필터링
            .map((recipe) =>
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
