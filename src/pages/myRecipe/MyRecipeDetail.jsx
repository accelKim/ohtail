import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const MyRecipeDetail = () => {
  const { id } = useParams();
  const [myRecipe, setMyRecipe] = useState(null);

  useEffect(() => {
    const fetchMyRecipe = async () => {
      try {
        const response = await fetch(`http://localhost:8080/myRecipe/${id}`);
        if (!response.ok) {
          throw new Error("레시피를 가져오는 중 오류 발생!!!!!");
        }
        const data = await response.json();
        setMyRecipe(data);
      } catch (error) {
        console.error("레시피를 가져오는 중 오류 발생!!!!!", error);
      }
    };

    fetchMyRecipe();
  }, [id]);

  if (!myRecipe) {
    return <p>로딩 중...</p>;
  }

  return (
    <main className="mw">
      <h2>{myRecipe.title}</h2>
      <img
        src={`http://localhost:8080/uploads/${myRecipe.files[0]}`}
        alt={myRecipe.title}
      />
      <p>{myRecipe.description}</p>
      <h3>재료</h3>
      <ul>
        {myRecipe.ingredients.map((ingredient, index) => (
          <li key={index}>
            {ingredient.name} - {ingredient.quantity} {ingredient.unit}
          </li>
        ))}
      </ul>
      <h3>만드는 방법</h3>
      <p>{myRecipe.instructions}</p>
    </main>
  );
};

export default MyRecipeDetail;
