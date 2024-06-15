import React, { useEffect, useState } from "react";
import MyRecipeCard from "../../components/myRecipe/MyRecipeCard";
import style from "../../styles/myRecipe/MyRecipeList.module.css";
import { Link, useNavigate } from "react-router-dom";

const MyRecipeList = () => {
  const [myRecipeList, setMyRecipeList] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyRecipes = async () => {
      try {
        const response = await fetch("http://localhost:8080/myRecipe");
        if (!response.ok) {
          throw new Error("레시피를 가져오는 중 오류 발생!!!!!");
        }
        const data = await response.json();
        setMyRecipeList(data);
      } catch (error) {
        console.error("레시피를 가져오는 중 오류 발생!!!!!", error);
      }
    };

    fetchMyRecipes();

    // 로컬 스토리지에서 userid를 가져와서 로그인 상태를 확인
    const userid = localStorage.getItem("userid");
    if (userid) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleButtonClick = () => {
    if (isLoggedIn) {
      navigate("/CreateMyRecipe");
    } else {
      navigate("/login");
    }
  };

  return (
    <main className="mw">
      <h2>나만의 레시피 목록</h2>
      <button onClick={handleButtonClick}>나만의 레시피 등록하기</button>
      {myRecipeList.length === 0 ? (
        <p>레시피가 없습니다</p>
      ) : (
        <ul>
          {myRecipeList.map((myRecipe) => (
            <MyRecipeCard key={myRecipe._id} myRecipe={myRecipe} />
          ))}
        </ul>
      )}
    </main>
  );
};

export default MyRecipeList;
