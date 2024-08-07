import React, { useEffect, useState } from "react";
import RecipeCard from "./RecipeCard";
import style from "../../styles/recipe/MainPageRecipe.module.css";

const MainPageRacipe = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const promises = Array.from({ length: 4 }, () =>
        fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php")
          .then((response) => response.json())
          .then((data) => data.drinks[0])
      );
      const results = await Promise.all(promises);
      setRecipes(results);
      localStorage.setItem("recipes", JSON.stringify(results));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedRecipes = localStorage.getItem("recipes");
    if (storedRecipes) {
      setRecipes(JSON.parse(storedRecipes));
      setLoading(false);
    } else {
      fetchRecipes();
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ul className={style.gridContainer}>
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.idDrink} recipe={recipe} />
      ))}
      <button onClick={fetchRecipes} className={style.reset_button}>
        <i class="fa-solid fa-arrows-rotate"></i>
      </button>
    </ul>
  );
};

export default MainPageRacipe;
