import React, { useEffect, useState } from "react";
import MyRecipeCard from "../../components/myRecipe/MyRecipeCard"; // MyRecipeCard 컴포넌트 임포트

const Favorites = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8080/bookmarks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log("Fetched bookmarks:", data);

        const recipePromises = data.map((bookmark) =>
          fetch(`http://localhost:8080/myRecipe/${bookmark.cocktailId}`).then(
            (res) => res.json()
          )
        );

        const recipeData = await Promise.all(recipePromises);
        setRecipes(recipeData);
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <div>
      <h2>My Bookmarks</h2>
      <ul>
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <MyRecipeCard key={recipe._id} myRecipe={recipe} />
          ))
        ) : (
          <p>즐겨찾기한 레시피를 찾을 수 없어요!!!</p>
        )}
      </ul>
    </div>
  );
};

export default Favorites;
