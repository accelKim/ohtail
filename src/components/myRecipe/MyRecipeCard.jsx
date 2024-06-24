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
          throw new Error("Failed to fetch like count");
        }
        const data = await response.json();
        setLikeCount(data.likeCount);
      } catch (error) {
        console.error("Error fetching like count:", error);
      }
    };

    fetchLikeCount();
  }, [myRecipe._id]);

  return (
    <li className={styles.card} onClick={handleCardClick}>
      <article>
        {myRecipe.files && myRecipe.files.length > 0 && (
          <figure className={styles.imageCon}>
            <img
              src={`http://localhost:8080/${myRecipe.files[0]}`}
              alt={myRecipe.title}
              className={styles.image}
            />
            <figcaption className={styles.imageText}>
              <h3>{myRecipe.title}</h3>
              <p>{myRecipe.author}</p>
              <p>좋아요: {likeCount}</p>
            </figcaption>
          </figure>
        )}
      </article>
    </li>
  );
};

export default MyRecipeCard;
