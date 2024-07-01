import React, { useState, useEffect } from "react";

const FavoritesButton = ({ cocktailId, userId, isExternal = false }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8080/favorites", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (Array.isArray(data)) {
          console.log("즐겨찾기 데이터", data);
          const favorited = data.some(
            (favorite) =>
              favorite.cocktailId === cocktailId &&
              favorite.isExternal === isExternal
          );
          console.log("즐겨찾기 상태", favorited);
          setIsFavorited(favorited);
          setLoaded(true);
        } else {
          console.error("응답 형식 오류!!!", data);
        }
      } catch (error) {
        console.error("오류 발생!!!", error);
      }
    };

    checkFavorite();
  }, [cocktailId, isExternal]);

  // 즐겨찾기 상태 토글
  const handleFavorite = async () => {
    try {
      const token = localStorage.getItem("token");
      const method = isFavorited ? "DELETE" : "POST";
      console.log(
        `Sending ${method} request to /favorite with cocktailId: ${cocktailId}, userId: ${userId}, isExternal: ${isExternal}`
      );
      const response = await fetch("http://localhost:8080/favorite", {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cocktailId, userId, isExternal }),
      });
      if (response.ok) {
        console.log("토글 성공!!!");
        setIsFavorited(!isFavorited);
      } else {
        const errorData = await response.json();
        console.error("토글 오류!!!", errorData.message);
      }
    } catch (error) {
      console.error("즐겨찾기 중 토글 오류!!!", error);
    }
  };

  // 즐겨찾기 로딩
  if (!loaded) {
    return <button disabled>불러오는 중</button>;
  }

  return (
    <button onClick={handleFavorite}>
      {isFavorited ? "즐겨찾기 취소" : "즐겨찾기"}
    </button>
  );
};

export default FavoritesButton;
