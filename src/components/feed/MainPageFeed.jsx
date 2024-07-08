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
      const response = await fetch('http://localhost:5001/feedList');
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
      <ul>
        {sortedFeeds.map((feed) => (
          <li key={feed._id} className={style.feedList}>
            <Link to={`/feedDetail/${feed._id}`}>{feed.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MainPageFeed;
