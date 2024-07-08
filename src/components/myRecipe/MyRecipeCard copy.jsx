import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/myRecipe/MyRecipeCard.module.css";

const MyRecipeCard = ({ myRecipe }) => {
  const navigate = useNavigate();
  const [likeCount, setLikeCount] = useState(0);

  const handleCardClick = () => {
    navigate(`/myRecipe/${myRecipe._id}`);
  };

  useEffect(() => {
    const fetchLikeCount = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/likes?cocktailId=${myRecipe._id}`
        );
        if (!response.ok) {
          throw new Error("좋아요 불러오기 실패!!!");
        }
        const data = await response.json();
        setLikeCount(data.likeCount);
      } catch (error) {
        console.error("좋아요 오류!!", error);
      }
    };

    fetchLikeCount();
  }, [myRecipe._id]);

  return (
    <li className={styles.card} onClick={handleCardClick}>
      <article>
        {myRecipe.files && myRecipe.files.length > 0 && (
          <figure className={styles.imgCon}>
            <img
              src={`http://localhost:8080/${myRecipe.files[0]}`}
              alt={myRecipe.title}
              className={styles.image}
            />
            <figcaption className={styles.imgText}>
              <h3>{myRecipe.title}</h3>
              <span>@ {myRecipe.authorNickname}</span>
              <p>좋아요: {likeCount}</p>
            </figcaption>
          </figure>
        )}
      </article>
    </li>
  );
};

export default MyRecipeCard;
