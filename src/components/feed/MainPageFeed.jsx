import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import style from '../../styles/feed/MainFeed.module.css';

const MainPageFeed = () => {
  const [feeds, setFeeds] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeeds();
  }, []);

  const fetchFeeds = async () => {
    try {
      const response = await fetch('http://localhost:8080/feedList');
      if (!response.ok) {
        throw new Error('Failed to fetch feeds');
      }
      const data = await response.json();
      setFeeds(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const sortedFeeds = feeds
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10);

  return (
    <div className={style.mainFeed}>
      {error && <p>Error: {error}</p>}
      <div>
        {sortedFeeds.map((feed) => (
          <Link
            to={`/feedDetail/${feed._id}`}
            key={feed._id}
            className={style.feedItem}
          >
            <div className={style.feedContent}>
              <span className={style.feedTitle}>{feed.title}</span>
            </div>
            <span className={style.feedDate}>
              {new Date(feed.createdAt).toLocaleDateString()}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MainPageFeed;
