import React, { useEffect, useState, useCallback } from "react";
import MyRecipeCard from "../../components/myRecipe/MyRecipeCard";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/myRecipe/SearchBar";
import MyRecipeCategory from "../../components/myRecipe/MyRecipeCategory";
import style from "../../styles/myRecipe/MyRecipeList.module.css";

const MyRecipeList = () => {
  const [myRecipeList, setMyRecipeList] = useState([]);
  const [filteredRecipeList, setFilteredRecipeList] = useState([]);
  const [sortOption, setSortOption] = useState("newest");
  const [searchTerm, setSearchTerm] = useState("");
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

  const handleSearch = useCallback(
    (term) => {
      setSearchTerm(term);
      let filtered = myRecipeList.filter((recipe) =>
        recipe.title.toLowerCase().includes(term.toLowerCase())
      );

      if (sortOption === "newest") {
        filtered = filtered.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      } else if (sortOption === "oldest") {
        filtered = filtered.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      }

      setFilteredRecipeList(filtered);
    },
    [myRecipeList, sortOption]
  );

  useEffect(() => {
    handleSearch(searchTerm); // 검색어 유지하며 정렬
  }, [handleSearch, searchTerm, sortOption]);

  const handleButtonClick = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/createMyRecipe");
    } else {
      navigate("/login");
    }
  };

  const handleSortChange = (value) => {
    setSortOption(value);
  };

  return (
    <main className="mw">
      <h2>나만의 레시피 목록</h2>
      <SearchBar onSearch={handleSearch} />
      <MyRecipeCategory
        sortOption={sortOption}
        onSortChange={handleSortChange}
      />
      <button className={style.addBtn} onClick={handleButtonClick}>
        나만의 레시피 등록하기
      </button>

      {filteredRecipeList.length === 0 ? (
        <p>레시피가 없습니다</p>
      ) : (
        <ul className={style.gridContainer}>
          {filteredRecipeList.map((myRecipe) => (
            <MyRecipeCard key={myRecipe._id} myRecipe={myRecipe} />
          ))}
        </ul>
      )}
    </main>
  );
};

export default MyRecipeList;
