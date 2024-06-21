import React from 'react';
import style from '../../styles/feed/Feed.module.css';
import { Link } from 'react-router-dom';
import SearchBar from '../../components/recipe/SearchBar';

const Feed = () => {
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
          <a href="/" className={style.feedimg}>
            <img src="" alt="" />
          </a>
          <a href="/" className={style.feedimg}>
            <img src="" alt="" />
          </a>{' '}
          <a href="/" className={style.feedimg}>
            <img src="" alt="" />
          </a>{' '}
          <a href="/" className={style.feedimg}>
            <img src="" alt="" />
          </a>{' '}
          <a href="/" className={style.feedimg}>
            <img src="" alt="" />
          </a>{' '}
          <a href="/" className={style.feedimg}>
            <img src="" alt="" />
          </a>{' '}
          <a href="/" className={style.feedimg}>
            <img src="" alt="" />
          </a>{' '}
          <a href="/" className={style.feedimg}>
            <img src="" alt="" />
          </a>{' '}
          <a href="/" className={style.feedimg}>
            <img src="" alt="" />
          </a>{' '}
          <a href="/" className={style.feedimg}>
            <img src="" alt="" />
          </a>{' '}
          <a href="/" className={style.feedimg}>
            <img src="" alt="" />
          </a>{' '}
          <a href="/" className={style.feedimg}>
            <img src="" alt="" />
          </a>{' '}
          <a href="/" className={style.feedimg}>
            <img src="" alt="" />
          </a>{' '}
          <a href="/" className={style.feedimg}>
            <img src="" alt="" />
          </a>{' '}
          <a href="/" className={style.feedimg}>
            <img src="" alt="" />
          </a>{' '}
          <a href="/" className={style.feedimg}>
            <img src="" alt="" />
          </a>
        </div>
        <button>
          <Link to="/createFeed"> +</Link>
        </button>
      </div>
    </div>
  );
};

export default Feed;
