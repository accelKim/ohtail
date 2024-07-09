import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const FavoritesButton = ({ cocktailId, userId, isExternal = false }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const token = localStorage.getItem("token");
        let url = "https://web-ohtail-ly8dqscw04c35e9c.sel5.cloudtype.app/api/favorites";
        if (token) {
          const response = await fetch(url, {
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
        } else {
          setLoaded(true);
        }
      } catch (error) {
        console.error("오류 발생!!!", error);
      }
    };

    checkFavorite();
  }, [cocktailId, isExternal]);

  // 미로그인 처리
  const handleFavorite = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const method = isFavorited ? "DELETE" : "POST";
      const response = await fetch("https://web-ohtail-ly8dqscw04c35e9c.sel5.cloudtype.app/api/favorite", {
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
