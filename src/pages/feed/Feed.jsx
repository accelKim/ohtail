import React, { useState, useEffect } from 'react';
import style from '../../styles/feed/Feed.module.css';
import { Link } from 'react-router-dom';

const Feed = () => {
  const [feedList, setFeedList] = useState([]);

  useEffect(() => {
    fetchFeeds(); // 페이지가 로드될 때 피드를 가져오는 함수 호출
  }, []); // 빈 배열을 전달하여 한 번만 호출되도록 설정

  const fetchFeeds = async () => {
    try {
      const response = await fetch('http://localhost:8080/feedList');
      if (!response.ok) {
        throw new Error('Failed to fetch feeds');
      }
      const data = await response.json();
      // data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setFeedList(data); // 받아온 데이터를 상태에 저장
    } catch (error) {
      console.error('Error fetching feeds:', error);
      // 필요한 에러 핸들링
    }
  };

  return (
    <div className={style.wrap}>
      <div className={style.feed}>
        <img
          src="../../../public/img/search.svg"
          alt=""
          className={style.searchIcon}
        />
        <input type="text" placeholder="검색어를 입력해주세요" />
        <div className={style.feedContainer}>
          {feedList.map((feed) => (
            <Link
              to={`/feed/${feed._id}`}
              key={feed._id}
              className={style.feedImg}
            >
              <img src={feed.cover} alt="" /> {/* 이미지 경로 */}
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
