import React, { useEffect, useState } from "react";
import MyRecipeCard from "../../components/myRecipe/MyRecipeCard";
import style from "../../styles/myRecipe/MainPageMyRecipe.module.css";

const MainPageMyRecipe = () => {
  const [recentRecipes, setRecentRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentRecipes = async () => {
      try {
        const response = await fetch("http://localhost:5001/myRecipe");
        if (!response.ok) {
          throw new Error("레시피를 가져오는 중 오류 발생!");
        }
        const data = await response.json();
        const sortedData = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setRecentRecipes(sortedData.slice(0, 4));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentRecipes();
  }, []);

  if (loading) {
    return <p>로딩 중...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <ul className={style.gridContainer}>
      {recentRecipes.map((recipe) => (
        <MyRecipeCard key={recipe._id} myRecipe={recipe} />
      ))}
    </ul>
  );
};

export default MainPageMyRecipe;
