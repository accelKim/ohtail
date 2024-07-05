import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import style from '../../../styles/feed/FeedsTab.module.css';

const FeedsTab = () => {
  const [feeds, setFeeds] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userid');
    setCurrentUserId(userId);

    const fetchFeeds = async () => {
      try {
        const response = await axios.get('http://localhost:8080/feeds');
        setFeeds(response.data);
      } catch (error) {
        console.error('피드 데이터를 가져오는 중 오류 발생:', error);
      }
    };

    fetchFeeds();
  }, []);

  const userFeeds = feeds.filter((feed) => {
    const isAuthor = feed.author === currentUserId;

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
