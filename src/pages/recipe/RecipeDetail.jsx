import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import LikeButton from '../../components/like/LikeButton';
import CommentSection from '../../components/Comment/CommentSection';
import FavoritesButton from '../../components/favorites/FavoritesButton';
import CopyUrlButton from '../../components/copyUrl/CopyUrlButton';
import style from '../../styles/recipe/RecipeDetail.module.css';

const RecipeDetail = () => {
  const { id } = useParams();
  const [cocktail, setCocktail] = useState(null);
  const [translatedInstructions, setTranslatedInstructions] = useState('');
  const [translatedIngredients, setTranslatedIngredients] = useState([]);
  const [userId, setUserId] = useState(null);
  const apiKey = process.env.REACT_APP_TRANSLATE_API_KEY;

  useEffect(() => {
    //로컬에서 유저아이디 가져오기 추후 토큰으로 변경예정
    const storedUserId = localStorage.getItem('userid');
    setUserId(storedUserId);

    fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`)
      .then((response) => response.json())
      .then((data) => {
        setCocktail(data.drinks[0]);
        return data.drinks[0];
      })
      .then((cocktail) => {
        translateText(cocktail.strInstructions, setTranslatedInstructions);
        const ingredients = Object.keys(cocktail)
          .filter((key) => key.startsWith('strIngredient') && cocktail[key])
          .map((key) => {
            const index = key.replace('strIngredient', '');
            const measure = cocktail[`strMeasure${index}`];
            return {
              ingredient: cocktail[key],
              measure: measure || 'to taste',
            };
          });

        Promise.all(
          ingredients.map(async (item) => {
            const translatedIngredient = await translateText(item.ingredient);
            return { ...item, translatedIngredient };
          })
        ).then((translated) => setTranslatedIngredients(translated));
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, [id]);

  const translateText = async (text, setState) => {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
          q: text,
          source: 'en',
          target: 'ko',
          format: 'text',
        }),
      }
    );
    const data = await response.json();
    if (setState) {
      setState(data.data.translations[0].translatedText);
    }
    return data.data.translations[0].translatedText;
  };

  if (!cocktail) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`${style.recipe_wrap} mw`}>
      <h1 className={style.recipe_title}>{cocktail.strDrink}</h1>
      <div className={style.recipe_img_wrap}>
        <img
          src={cocktail.strDrinkThumb}
          alt={cocktail.strDrink}
          className={style.recipe_img}
        />
      </div>
      <p className={style.recipe_contents}>{translatedInstructions}</p>
      <ul className={style.ingredient_wrap}>
        {translatedIngredients.map((item, index) => (
          <li key={index} className={style.ingredient}>
            <p className={style.ingredient_title}>
              {item.translatedIngredient
                ? item.translatedIngredient
                : item.ingredient}
            </p>
            <div className={style.ingredient_capacity_wrap}>
              <p className={style.ingredient_capacity}>{item.measure}</p>
              <img
                src={`https://www.thecocktaildb.com/images/ingredients/${item.ingredient}-Small.png`}
                alt={item.ingredient}
                className={style.ingredient_img}
              />
            </div>
          </li>
        ))}
      </ul>
      <div className={style.clientBtnArea}>
        {/* 즐겨찾기 버튼 추가  */}
        <FavoritesButton cocktailId={id} userId={userId} isExternal={true} />
        <LikeButton cocktailId={id} userId={userId} type="recipe" />
        <CopyUrlButton />
      </div>
      {/* 댓글 타입 recipe 추가 */}
      <CommentSection cocktailId={id} userId={userId} type="recipe" />
    </div>
  );
};

export default RecipeDetail;
