import React, { useEffect, useState, useCallback } from "react";
import MyRecipeCard from "../../components/myRecipe/MyRecipeCard";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/myRecipe/SearchBar";
import MyRecipeCategory from "../../components/myRecipe/MyRecipeCategory";
import Pagination from "../../components/pagination/Pagination";
import style from "../../styles/myRecipe/MyRecipeList.module.css";

const MyRecipeList = () => {
  const [myRecipeList, setMyRecipeList] = useState([]);
  const [filteredRecipeList, setFilteredRecipeList] = useState([]);
  const [sortOption, setSortOption] = useState(
    localStorage.getItem("sortOption") || "newest"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyRecipes = async () => {
      try {
        const response = await fetch(
          `https://web-ohtail-ly8dqscw04c35e9c.sel5.cloudtype.app/api/myRecipe`
        );
        // const response = await fetch(`http://localhost:8080/myRecipe`);
        if (!response.ok) {
          throw new Error("레시피를 가져오는 중 오류 발생!!!!!");
        }
        const data = await response.json();

        // 각 레시피에 좋아요 수를 추가
        const recipesWithLikes = await Promise.all(
          data.map(async (recipe) => {
            const likeResponse = await fetch(
              `https://web-ohtail-ly8dqscw04c35e9c.sel5.cloudtype.app/api/likes?cocktailId=${recipe._id}&type=myRecipe`
              // `http://localhost:8080/likes?cocktailId=${recipe._id}&type=myRecipe`
            );
            if (likeResponse.ok) {
              const likeData = await likeResponse.json();
              return { ...recipe, likeCount: likeData.likeCount };
            } else {
              return { ...recipe, likeCount: 0 };
            }
          })
        );

        setMyRecipeList(recipesWithLikes);
        setFilteredRecipeList(recipesWithLikes);
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
      } else if (sortOption === "mostLiked") {
        filtered = filtered.sort((a, b) => b.likeCount - a.likeCount);
      }

      setFilteredRecipeList(filtered);
      setCurrentPage(1);
    },
    [myRecipeList, sortOption]
  );

  useEffect(() => {
    handleSearch(searchTerm);
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
    localStorage.setItem("sortOption", value);
  };

  const handleClick = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentResults = filteredRecipeList.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <main className="mw">
      <h2>나만의 레시피</h2>
      <SearchBar onSearch={handleSearch} />
      <div className={style.actionBar}>
        <MyRecipeCategory
          sortOption={sortOption}
          onSortChange={handleSortChange}
        />
        <button className={style.addBtn} onClick={handleButtonClick}>
          나만의 레시피 등록하기
        </button>
      </div>
      {filteredRecipeList.length === 0 ? (
        <p className={style.noResult}>검색 결과가 없습니다</p>
      ) : (
        <ul className={style.gridContainer}>
          {currentResults.map((myRecipe) => (
            <MyRecipeCard key={myRecipe._id} myRecipe={myRecipe} />
          ))}
        </ul>
      )}
      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={filteredRecipeList.length}
        currentPage={currentPage}
        handleClick={handleClick}
      />
    </main>
  );
};

export default MyRecipeList;
