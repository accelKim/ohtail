import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import style from "../../styles/feed/Feed.module.css";
import SearchBar from "../../components/feed/SearchBar";
import { useNavigate } from "react-router-dom";
const apiUrl = process.env.REACT_APP_API_URL
const Feed = () => {
  const [feedList, setFeedList] = useState([]);
  const [error, setError] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState(''); // 검색어 상태 추가
  const navigate = useNavigate(); // useNavigate 훅 사용

  useEffect(() => {
    fetchFeeds(); // 컴포넌트가 마운트될 때 피드를 가져옴
  }, []);

  const fetchFeeds = async () => {
    try {
      const response = await fetch(`${apiUrl}/feedList`);
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

  const handleCreateFeedClick = () => {
    // 로그인 상태 확인
    const isLoggedIn = localStorage.getItem('token') !== null; // 예시로 localStorage에서 token을 사용하여 로그인 상태 확인

    if (!isLoggedIn) {
      // 로그인이 되어있지 않으면 로그인 페이지로 이동
      navigate('/login');
    } else {
      // 로그인이 되어 있으면 createFeed 페이지로 이동
      navigate('/createFeed');
    }
  };

  // 검색어를 기준으로 피드 필터링
  const filteredFeeds = feedList.filter((feed) =>
    feed.title.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <div className="mw">
      <SearchBar onSearch={setSearchKeyword} />
      <div className={style.feedContainer}>
        {error ? (
          <p>오류: {error}</p>
        ) : filteredFeeds.length > 0 ? (
          filteredFeeds.map((feed) => (
            <Link
              to={`/feedDetail/${feed._id}`}
              key={feed._id}
              className={style.feedImg}
            >
              <img src={feed.cover} alt={feed.title} />
              <figcaption className={style.imgText}>
                <h3>{feed.title}</h3>
              </figcaption>
            </Link>
          ))
        ) : (
          <p>검색 결과가 없습니다</p>
        )}
      </div>
      <button className={style.createButton} onClick={handleCreateFeedClick}>
        <div className={style.plusIcon}></div>
      </button>
    </div>
  );
};

export default Feed;
