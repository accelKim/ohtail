// MyRecipeList.js
import React, { useEffect, useState } from "react";
import MyRecipeCard from "../../components/myRecipe/MyRecipeCard";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/myRecipe/SearchBar";

const MyRecipeList = () => {
  const [myRecipeList, setMyRecipeList] = useState([]);
  const [filteredRecipeList, setFilteredRecipeList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyRecipes = async () => {
      try {
        const response = await fetch(`http://localhost:8080/myRecipe`);
        if (!response.ok) {
          throw new Error("레시피를 가져오는 중 오류 발생!!!!!");
        }
        const data = await response.json();
        setMyRecipeList(data);
        setFilteredRecipeList(data); // 필터된 목록 초기화
      } catch (error) {
        console.error("레시피를 가져오는 중 오류 발생!!!!!", error);
      }
    };

    fetchMyRecipes();
  }, []);

  const handleButtonClick = () => {
    navigate("/createMyRecipe");
  };

  const handleSearch = (searchTerm) => {
    const filtered = myRecipeList.filter((recipe) =>
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRecipeList(filtered);
  };

  return (
    <main className="mw">
      <h2>나만의 레시피 목록</h2>
      <SearchBar onSearch={handleSearch} />
      <button onClick={handleButtonClick}>나만의 레시피 등록하기</button>
      {filteredRecipeList.length === 0 ? (
        <p>레시피가 없습니다</p>
      ) : (
        <ul>
          {filteredRecipeList.map((myRecipe) => (
            <MyRecipeCard key={myRecipe._id} myRecipe={myRecipe} />
          ))}
        </ul>
      )}
    </main>
  );
};

export default MyRecipeList;
