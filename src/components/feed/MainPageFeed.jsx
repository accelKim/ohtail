import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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

  // 최신순으로 정렬하고 최대 10개의 피드 제목만 가져오기
  const sortedFeeds = feeds
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10);

  return (
    <div>
      {error && <p>Error: {error}</p>}
      <ul>
        {sortedFeeds.map((feed) => (
          <li key={feed._id}>
            <Link to={`/feed/${feed._id}`}>{feed.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MainPageFeed;
