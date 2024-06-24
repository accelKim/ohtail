import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import style from '../../styles/feed/FeedDetail.module.css';

const FeedDetailPage = () => {
  const { id } = useParams(); // useParams 훅을 사용하여 URL 파라미터(id)를 가져옴
  const [feed, setFeed] = useState(null); // 피드 데이터를 저장할 상태 변수

  useEffect(() => {
    const fetchFeedDetail = async () => {
      try {
        const response = await fetch(`http://localhost:8080/feedDetail/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch feed detail');
        }
        const data = await response.json();
        setFeed(data); // 받아온 피드 데이터를 상태에 저장
      } catch (error) {
        console.error('Error fetching feed detail:', error);
        // 필요한 에러 핸들링
      }
    };

    fetchFeedDetail(); // 페이지가 로드될 때 한 번 데이터를 가져오도록 호출
  }, [id]); // id가 변경될 때마다 데이터를 새로 요청하도록 useEffect의 의존성 배열에 추가

  if (!feed) {
    return <p>Loading...</p>; // 데이터 로딩 중일 때 표시할 화면
  }

  return (
    <div className={style.wrap}>
      <section className={style.feedDetail}>
        <img src={feed.cover} alt="" /> {/* 피드의 이미지 */}
        <h3>{feed.title}</h3> {/* 피드의 제목 */}
        <div>{feed.content}</div> {/* 피드의 내용 */}
      </section>
      <Link to="/feed">Back to Feed</Link>{' '}
      {/* 피드 목록 페이지로 이동하는 링크 */}
    </div>
  );
};

export default FeedDetailPage;
