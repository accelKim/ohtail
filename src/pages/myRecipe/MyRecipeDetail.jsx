import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const MyRecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [myRecipe, setMyRecipe] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserId(payload.userid);
    }

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

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:8080/myRecipe/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("삭제 요청 실패:", errorData);
        throw new Error(errorData.message || "삭제 중 오류 발생!!!!!");
      }
      console.log("레시피가 삭제되었습니다.");
      navigate("/myRecipe");
    } catch (error) {
      console.error("삭제 중 오류 발생!!!!!", error);
      alert(error.message);
    }
  };

  const handleEdit = () => {
    navigate(`/editMyRecipe/${myRecipe._id}`);
  };

  if (!myRecipe) {
    return <p>로딩 중...</p>;
  }

  return (
    <main className="mw">
      <h2>레시피 제목: {myRecipe.title}</h2>
      <h3>작성자: {myRecipe.author}</h3>
      <div>
        {myRecipe.files.map((file, index) => {
          const imageUrl = `http://localhost:8080/${file}`;
          console.log(`이미지 URL ${index}:`, imageUrl);
          return (
            <img
              key={index}
              src={imageUrl}
              alt={`${myRecipe.title} 이미지 ${index + 1}`}
            />
          );
        })}
      </div>
      <h3>레시피 설명: {myRecipe.description}</h3>
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
      {userId &&
        myRecipe.author &&
        userId.toString() === myRecipe.author.toString() && (
          <>
            <button onClick={handleEdit}>수정</button>
            <button onClick={handleDelete}>삭제</button>
          </>
        )}
    </main>
  );
};

export default MyRecipeDetail;
