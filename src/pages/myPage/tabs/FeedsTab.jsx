import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from '../../../styles/feed/FeedsTab.module.css';

const FeedsTab = () => {
  const [feeds, setFeeds] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userid');

    if (userId) {
      setCurrentUserId(userId);

      const fetchFeeds = async () => {
        try {
          const response = await axios.get('http://localhost:8080/feedList');
          setFeeds(response.data);
        } catch (error) {
          console.error('피드 데이터를 가져오는 중 오류 발생:', error);
        }
      };

      fetchFeeds();
    } else {
      console.error('사용자 ID가 로컬 스토리지에 없습니다.');
    }
  }, []);

  const userFeeds = feeds.filter((feed) => feed.author === currentUserId);

  return (
    <div className="mw">
      <div className={styles.feedsTabcon}>
        {userFeeds.length > 0 ? (
          userFeeds.map((feed) => (
            <div key={feed._id}>
              <Link
                to={`/feedDetail/${feed._id}`}
                className={styles.feedsTabImg}
              >
                {feed.cover && <img src={feed.cover} alt="피드 이미지" />}
                <figcaption className={styles.imgText}>
                  <h3>{feed.title}</h3>
                </figcaption>
              </Link>
            </div>
          ))
        ) : (
          <p>작성한 피드가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default FeedsTab;
