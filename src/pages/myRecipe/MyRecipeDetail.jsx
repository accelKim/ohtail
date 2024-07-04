import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, EffectCoverflow } from "swiper/modules";
import style from "../../styles/myRecipe/MyRecipeDetail.module.css";
import LikeButton from "../../components/like/LikeButton";
import CommentSection from "../../components/Comment/CommentSection";
import FavoritesButton from "../../components/favorites/FavoritesButton";

const MyRecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [myRecipe, setMyRecipe] = useState(null);
  const [userId, setUserId] = useState(null);

  const [ingredientImages, setIngredientImages] = useState({});
  const [translatedIngredients, setTranslatedIngredients] = useState([]);
  const apiKey = process.env.REACT_APP_TRANSLATE_API_KEY;

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

        // Fetch ingredient images
        const images = {};
        for (const ingredient of data.ingredients) {
          const imgResponse = await fetch(
            `https://www.thecocktaildb.com/images/ingredients/${ingredient.name}-Small.png`
          );
          if (imgResponse.ok) {
            images[ingredient.name] = imgResponse.url;
          } else {
            images[ingredient.name] = null; // 이미지가 없을 경우
          }
        }
        setIngredientImages(images);

        // Translate ingredients
        Promise.all(
          data.ingredients.map(async (ingredient) => {
            const translatedName = await translateText(ingredient.name);
            return { ...ingredient, translatedName };
          })
        ).then((translated) => setTranslatedIngredients(translated));
      } catch (error) {
        console.error("레시피를 가져오는 중 오류 발생!!!!!", error);
      }
    };

    fetchMyRecipe();
  }, [id]);

  const translateText = async (text, setState) => {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          q: text,
          source: "en",
          target: "ko",
          format: "text",
        }),
      }
    );
    const data = await response.json();
    if (setState) {
      setState(data.data.translations[0].translatedText);
    }
    return data.data.translations[0].translatedText;
  };

  const handleEdit = () => {
    navigate(`/editMyRecipe/${myRecipe._id}`);
  };

  if (!myRecipe) {
    return <p>로딩 중...</p>;
  }

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

  // 개행 처리를 위한 코드
  const formattedInstructions = myRecipe.instructions
    .split("\n")
    .map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));

  return (
    <main className={`mw ${style.main}`}>
      <h2 className={style.title}>{myRecipe.title}</h2>
      <p className={style.authorNickname}>{myRecipe.authorNickname}</p>
      <Swiper
        slidesPerView={3}
        centeredSlides={true}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        effect="coverflow"
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 2.5,
          slideShadows: false,
        }}
        modules={[Pagination, EffectCoverflow]}
        className={style.mySwiper}
      >
        {myRecipe.files.map((file, index) => {
          const imageUrl = `http://localhost:8080/${file}`;
          console.log(`이미지 URL ${index}:`, imageUrl);
          return (
            <SwiperSlide key={index} className={style.swiperSlide}>
              <img
                src={imageUrl}
                alt={`${myRecipe.title} 이미지 ${index + 1}`}
                className={style.image}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
      <p className={style.desc}>{myRecipe.description}</p>
      <h3>재료 정보</h3>
      <ul className={style.ingredientCon}>
        {translatedIngredients.map((ingredient, index) => (
          <li key={index} className={style.ingredientItem}>
            <span>{ingredient.translatedName}</span>
            <div className={style.measureWrap}>
              <span>{ingredient.quantity}</span>
              <span>{ingredient.unit}</span>
              {ingredientImages[ingredient.name] && (
                <img
                  src={ingredientImages[ingredient.name]}
                  alt={ingredient.name}
                  className={style.ingredientImg}
                />
              )}
            </div>
          </li>
        ))}
      </ul>
      <h3 className={style.subTitle}>만드는 방법</h3>
      <div className={style.instructions}>
        <p>{formattedInstructions}</p>
      </div>

      {userId &&
        myRecipe.author &&
        userId.toString() === myRecipe.author.toString() && (
          <div className={style.btnCon}>
            <button className={style.editBtn} onClick={handleEdit}>
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button className={style.delBtn} onClick={handleDelete}>
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        )}

      <LikeButton cocktailId={id} userId={userId} />
      <FavoritesButton cocktailId={id} userId={userId} />

      <CommentSection cocktailId={id} userId={userId} type="myRecipe" />
    </main>
  );
};

export default MyRecipeDetail;
