import React, { useState, useEffect } from 'react';
import style from '../../styles/feed/Feed.module.css';
import { Link } from 'react-router-dom';
import SearchBar from '../../components/feed/SearchBar';

const Feed = () => {
  const [feedList, setFeedList] = useState([]);

  useEffect(() => {
    fetchFeeds(); // 페이지가 로드될 때 피드를 가져오는 함수 호출
  }, []); // 빈 배열을 전달하여 한 번만 호출되도록 설정

  // 첫 번째 페이지의 피드를 가져오는 함수
  const fetchFeeds = async () => {
    try {
      const response = await fetch('http://localhost:8080/feedList');
      if (!response.ok) {
        throw new Error('Failed to fetch feeds');
      }
      const data = await response.json();
      console.log(data); // 데이터 확인용 콘솔 로그
      setFeedList(data); // 받아온 데이터를 상태에 저장
    } catch (error) {
      console.error('Error fetching feeds:', error);
      // 필요한 에러 핸들링
    }
  };

  return (
    <div className={style.wrap}>
      <SearchBar />
      <div className={style.feed}>
        <div className={style.feedContainer}>
          {feedList.map((feed) => (
            <Link
              to={`/feed/${feed._id}`}
              key={feed._id}
              className={style.feedImg}
            >
              <img src={feed.cover} alt="" />
            </Link>
          ))}
        </div>
        <button>
          <Link to="/createFeed">+</Link>
        </button>
      </div>
    </div>
  );
};

export default Feed;
