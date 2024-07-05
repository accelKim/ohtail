import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import style from '../../styles/feed/FeedDetail.module.css';
import LikeButton from '../../components/like/LikeButton';
import CommentSection from '../../components/Comment/CommentSection';

const FeedDetailPage = () => {
  const { id } = useParams();
  const [feed, setFeed] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeedDetail = async () => {
      try {
        const response = await fetch(`http://localhost:8080/feedDetail/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch feed detail');
        }
        const data = await response.json();
        console.log('Feed data:', data); // 데이터 로드 확인용 로그
        setFeed(data);
      } catch (error) {
        console.error('Error fetching feed detail:', error);
      }
    };

    fetchFeedDetail();

    // 로컬 스토리지에서 사용자 아이디 가져오기
    const storedUserId = localStorage.getItem('userid');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, [id]);

  if (!feed) {
    return <p>Loading...</p>;
  }

  const handleFeedDelete = () => {
    const confirmDelete = window.confirm('정말로 삭제하시겠습니까?');
    if (confirmDelete) {
      fetch(`http://localhost:8080/feedDelete/${id}`, {
        method: 'DELETE',
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.message === 'ok') {
            navigate('/feed');
          }
        })
        .catch((error) => {
          console.error('Error deleting feed:', error);
        });
    }
  };

  const handleEditClick = () => {
    navigate(`/feedEdit/${id}`);
  };

  return (
    <div className={style.wrap}>
      <section className={style.feedDetail}>
        <img src={feed.cover} alt="" />
        <h3>{feed.title}</h3>
        <p>작성자 : {feed.authorNickname}</p>
        <div>{feed.content}</div>
      </section>
      <section className={style.button}>
        {userId && userId === feed.author && (
          <React.Fragment>
            <button onClick={handleEditClick}>
              <i className="fa-solid fa-pen-to-square"></i>
            </button>
            <button onClick={handleFeedDelete}>
              <i className="fa-solid fa-trash"></i>
            </button>
          </React.Fragment>
        )}
      </section>
      <LikeButton cocktailId={id} userId={userId} />
      <CommentSection cocktailId={id} userId={userId} type="feed" />
    </div>
  );
};

export default FeedDetailPage;
