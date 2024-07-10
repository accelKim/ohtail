import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "../../../styles/feed/FeedsTab.module.css"; // 스타일을 styles로 가져옴
const apiUrl = process.env.REACT_APP_API_URL
const FeedsTab = () => {
  const [feeds, setFeeds] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userid");

    setCurrentUserId(userId);

    const fetchFeeds = async () => {
      try {
        const response = await axios.get(`${apiUrl}/feeds`);

        setFeeds(response.data);
      } catch (error) {
        console.error("피드 데이터를 가져오는 중 오류 발생:", error);
      }
    };

    fetchFeeds();
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
