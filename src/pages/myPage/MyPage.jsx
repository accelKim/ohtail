import React, { useState, useEffect } from "react";
import FavoritesTab from "./tabs/FavoritesTab";
import MyRecipeTab from "./tabs/MyRecipeTab";
import FeedsTab from "./tabs/FeedsTab";
import CommentsTab from "./tabs/CommentsTab";
import style from "../../styles/myPage/MyPage.module.css";
const apiUrl = process.env.REACT_APP_API_URL
const MyPage = () => {
  const [activeTab, setActiveTab] = useState("favorites");
  const [nickname, setNickname] = useState("");
  const [newNickname, setNewNickname] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserNickname = async () => {
      try {
        const token = localStorage.getItem("token"); // 토큰 가져오기
        if (!token) {
          console.error("토큰이 없습니다.");
          return;
        }

        const userId = JSON.parse(atob(token.split(".")[1])).userid; // 토큰에서 userid 추출
        console.log("추출된 userId:", userId);

        const response = await fetch(`${apiUrl}/user/${userId}`, {
          // const response = await fetch(`http://localhost:8080/user/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error("응답 오류:", response.status, response.statusText);
          throw new Error("유저 정보를 불러오는 데 실패했습니다.");
        }

        const data = await response.json();
        console.log("유저 정보:", data);
        setNickname(data.nickname);
      } catch (error) {
        console.error("유저 정보를 불러오는 중 오류 발생:", error);
      }
    };

    fetchUserNickname();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
    setNewNickname(nickname);
  };

  const handleSaveClick = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("토큰이 없습니다.");
        return;
      }

      const userId = JSON.parse(atob(token.split(".")[1])).userid;
      const response = await fetch(
        `${apiUrl}/user/${userId}/nickname`,

        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ nickname: newNickname }),
        }
      );

      if (!response.ok) {
        console.error("응답 오류:", response.status, response.statusText);
        throw new Error("닉네임 업데이트에 실패했습니다.");
      }

      const data = await response.json();
      console.log("닉네임 업데이트 결과:", data);
      setNickname(data.nickname);
      setIsEditing(false);
    } catch (error) {
      console.error("닉네임 업데이트 중 오류 발생:", error);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "favorites":
        return <FavoritesTab />;
      case "myRecipes":
        return <MyRecipeTab />;
      case "feeds":
        return <FeedsTab />;
      case "comments":
        return <CommentsTab />;
      default:
        return null;
    }
  };

  return (
    <main className={`mw ${style.main}`}>
      <h2>{nickname}님의 마이페이지</h2>
      <div className={style.profile}>
        <img src="./img/logo.png" alt="Profile" />
        {isEditing ? (
          <>
            <input
              type="text"
              value={newNickname}
              onChange={(e) => setNewNickname(e.target.value)}
              className={style.input}
            />
            <button onClick={handleSaveClick} className={style.button}>
              저장
            </button>
            <button onClick={handleCancelClick} className={style.button}>
              취소
            </button>
          </>
        ) : (
          <button onClick={handleEditClick} className={style.button}>
            프로필 수정
          </button>
        )}
      </div>
      <div className={style.tabs}>
        <button
          className={activeTab === "favorites" ? style.active : ""}
          onClick={() => setActiveTab("favorites")}
        >
          즐겨찾기
        </button>
        <button
          className={activeTab === "myRecipes" ? style.active : ""}
          onClick={() => setActiveTab("myRecipes")}
        >
          작성한 레시피
        </button>
        <button
          className={activeTab === "feeds" ? style.active : ""}
          onClick={() => setActiveTab("feeds")}
        >
          작성한 피드
        </button>
        <button
          className={activeTab === "comments" ? style.active : ""}
          onClick={() => setActiveTab("comments")}
        >
          작성한 댓글
        </button>
      </div>
      <div className={style.tabContent}>{renderTabContent()}</div>
    </main>
  );
};

export default MyPage;
