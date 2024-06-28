import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import style from '../../styles/feed/Feed.module.css';
import SearchBar from '../../components/feed/SearchBar';

const Feed = () => {
  const [feedList, setFeedList] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeeds(); // 컴포넌트가 마운트될 때 피드를 가져옴
  }, []);

  const fetchFeeds = async () => {
    try {
      const response = await fetch('http://localhost:8080/feedList');
      if (!response.ok) {
        throw new Error('피드를 가져오는데 실패했습니다');
      }
      const data = await response.json();
      console.log('Fetched feeds:', data); // 데이터를 콘솔에 출력
      setFeedList(data); // 가져온 데이터를 상태에 저장
    } catch (error) {
      console.error('Error fetching feeds:', error);
      setError(error.message); // 오류가 발생하면 오류 상태 설정
    }
  };

  return (
    <div className={style.wrap}>
      <SearchBar />
      <div className={style.feed}>
        <div className={style.feedContainer}>
          {error ? (
            <p>오류: {error}</p> // 오류 메시지를 표시
          ) : feedList.length > 0 ? (
            feedList.map((feed) => (
              <Link
                to={`/feed/${feed._id}`}
                key={feed._id}
                className={style.feedImg}
              >
                <img src={feed.cover} alt={feed.title} />
              </Link>
            ))
          ) : (
            <p>아직 피드가 없습니다</p> // 피드가 없을 때 메시지 표시
          )}
        </div>
      </div>
      <button className={style.createButton}>
        <Link to="/createFeed">
          <img src="/img/createButton.png" alt="새 피드 만들기" />
        </Link>
      </button>
    </div>
  );
};

export default Feed;
