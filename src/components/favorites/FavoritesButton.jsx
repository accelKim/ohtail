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
          console.log("Favorites data:", data);
          const favorited = data.some(
            (favorite) =>
              favorite.cocktailId === cocktailId &&
              favorite.isExternal === isExternal
          );
          console.log("Favorited status:", favorited);
          setIsFavorited(favorited);
          setLoaded(true);
        } else {
          console.error("Unexpected response format:", data);
        }
      } catch (error) {
        console.error("Error checking favorite:", error);
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
        console.log("Favorite toggled successfully");
        setIsFavorited(!isFavorited);
      } else {
        const errorData = await response.json();
        console.error("Error toggling favorite:", errorData.message);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
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
