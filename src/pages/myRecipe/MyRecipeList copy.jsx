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
  ); // 로컬 스토리지에서 정렬 옵션을 읽어옴
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
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
      } else if (sortOption === "mostLiked") {
        filtered = filtered.sort((a, b) => b.likeCount - a.likeCount); // 좋아요순 정렬
      }

      setFilteredRecipeList(filtered);
      setCurrentPage(1); // 검색어 변경 시 첫 페이지로 이동
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
    localStorage.setItem("sortOption", value); // 로컬 스토리지에 정렬 옵션 저장
  };

  const handleClick = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentResults = filteredRecipeList.slice(
    indexOfFirstItem,
    indexOfLastItem
  ); // 현재 페이지에 표시할 항목들

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
        <p>레시피가 없습니다</p>
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
