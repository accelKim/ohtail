import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import style from '../../../styles/feed/FeedsTab.module.css';

const FeedsTab = () => {
  const [feeds, setFeeds] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    // 로컬 스토리지에서 유저 ID 가져오기
    const userId = localStorage.getItem('userid');
    console.log('로컬 스토리지에서 가져온 userId:', userId); // 디버깅용 로그
    setCurrentUserId(userId);

    // 피드 데이터를 서버에서 가져오는 함수
    const fetchFeeds = async () => {
      try {
        const response = await axios.get('http://localhost:8080/feeds');
        console.log('서버에서 가져온 피드 데이터:', response.data); // 디버깅용 로그
        setFeeds(response.data);
      } catch (error) {
        console.error('피드 데이터를 가져오는 중 오류 발생:', error);
      }
    };

    fetchFeeds();
  }, []);

  // 사용자가 작성한 피드 필터링
  const userFeeds = feeds.filter((feed) => {
    const isAuthor = feed.author === currentUserId;
    console.log(
      `피드 ID: ${feed._id}, 작성자: ${feed.author}, 현재 유저: ${currentUserId}, 매치 여부: ${isAuthor}`
    ); // 디버깅용 로그
    return isAuthor;
  });

  return (
    <main className={style.wrap}>
      <div className={style.feedsTab}>
        <h2>피드</h2>
        <div className={style.feedcon}>
          {userFeeds.length > 0 ? (
            userFeeds.map((feed) => (
              <div key={feed._id} className={style.imgbox}>
                <Link to={`/feedDetail/${feed._id}`} className={style.feedsImg}>
                  {feed.cover && <img src={feed.cover} alt="피드 이미지" />}
                </Link>
              </div>
            ))
          ) : (
            <p>작성한 피드가 없습니다.</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default FeedsTab;
