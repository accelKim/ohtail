import React, { useEffect, useState } from 'react';
import { url } from '../../store/ref';

const WebzineLikeButton = ({ webzineId, user }) => {
  // const [likes, setLikes] = useState(0);
  // const [liked, setLiked] = useState(false);

  // useEffect(() => {
  //   fetch(`${url}/webzine/${webzineId}/likes`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setLikes(data.likes);
  //       setLiked(data.liked);
  //     });
  // }, [webzineId, user]);

  // const handleLike = () => {
  //   if (!user) {
  //     alert('로그인한 사용자만 좋아요를 누를 수 있습니다.');
  //     return;
  //   }

  //   fetch(`${url}/webzine/${webzineId}/like`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ liked: !liked }),
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setLikes(data.likes);
  //       setLiked(data.liked);
  //     });
  // };

  return <button>0</button>; // onClick={handleLike}
};

export default WebzineLikeButton;
