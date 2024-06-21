import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, EffectCoverflow } from 'swiper/modules';
import style from '../../styles/myRecipe/MyRecipeDetail.module.css';

const MyRecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [myRecipe, setMyRecipe] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserId(payload.userid);
    }

    const fetchMyRecipe = async () => {
      try {
        const response = await fetch(`http://localhost:8080/myRecipe/${id}`);
        if (!response.ok) {
          throw new Error('레시피를 가져오는 중 오류 발생!!!!!');
        }
        const data = await response.json();
        setMyRecipe(data);
      } catch (error) {
        console.error('레시피를 가져오는 중 오류 발생!!!!!', error);
      }
    };

    fetchMyRecipe();
  }, [id]);

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:8080/myRecipe/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error('삭제 요청 실패:', errorData);
        throw new Error(errorData.message || '삭제 중 오류 발생!!!!!');
      }
      console.log('레시피가 삭제되었습니다.');
      navigate('/myRecipe');
    } catch (error) {
      console.error('삭제 중 오류 발생!!!!!', error);
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
    <main className={`mw ${style.main}`}>
      <h2 className={style.title}>{myRecipe.title}</h2>
      <p className={style.author}>{myRecipe.author}</p>
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
      <h3 className={style.subTitle}>재료 정보</h3>
      <ul className={style.ingredientCon}>
        {myRecipe.ingredients.map((ingredient, index) => (
          <li key={index} className={style.ingredientItem}>
            <span>{ingredient.name}</span>
            <span>{ingredient.quantity}</span>
            <span>{ingredient.unit}</span>
          </li>
        ))}
      </ul>
      <h3 className={style.subTitle}>만드는 방법</h3>
      <p className={style.instructions}>{myRecipe.instructions}</p>
      {userId &&
        myRecipe.author &&
        userId.toString() === myRecipe.author.toString() && (
          <div className={style.buttonContainer}>
            <button className={style.editBtn} onClick={handleEdit}>
              수정
            </button>
            <button className={style.deleteBtn} onClick={handleDelete}>
              삭제
            </button>
          </div>
        )}
    </main>
  );
};

export default MyRecipeDetail;
