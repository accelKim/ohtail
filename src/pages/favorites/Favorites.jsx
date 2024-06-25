import React, { useEffect, useState } from "react";
import MyRecipeCard from "../../components/myRecipe/MyRecipeCard";
import RecipeList from "../../components/recipe/RecipeList";

const Favorites = () => {
  const [myRecipes, setMyRecipes] = useState([]);
  const [recipes, setRecipes] = useState([]);

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

        // 나만의 레시피 공식 레시피 분리
        const myRecipes = data.filter((favorite) => !favorite.isExternal);
        const recipes = data.filter((favorite) => favorite.isExternal);

        // 나만의 레시피 데이터를 가져오는 프로미스 배열 생성
        const myRecipePromises = myRecipes.map((favorite) =>
          fetch(`http://localhost:8080/myRecipe/${favorite.cocktailId}`).then(
            (res) => res.json()
          )
        );

        // 공식 레시피 데이터를 가져오는 프로미스 배열 생성
        const recipePromises = recipes.map((favorite) =>
          fetch(
            `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${favorite.cocktailId}`
          ).then((res) => res.json())
        );

        // 모든 프로미스를 실행, 데이터 가져옴
        const myRecipeData = await Promise.all(myRecipePromises);
        const recipeData = await Promise.all(recipePromises);

        // 가져온 데이터 저장
        setMyRecipes(myRecipeData);
        setRecipes(recipeData.map((response) => response.drinks[0]));
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <div>
      <h2>즐겨찾기한 레시피</h2>
      <ul>
        {myRecipes.length > 0 ? (
          myRecipes.map((myRecipe) => (
            <MyRecipeCard key={myRecipe._id} myRecipe={myRecipe} />
          ))
        ) : (
          <p>즐겨찾기한 레시피를 찾을 수 없어요!!!</p>
        )}
      </ul>
      <RecipeList searchResults={recipes} hasSearched={true} />
    </div>
  );
};

export default Favorites;
