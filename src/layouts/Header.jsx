import React from 'react';
import style from '../styles/Header.module.css';

const Header = () => {
  return (
    <header className={style.hd}>
      <div className="mw">
        <div className={style.ham}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <h1>
          <a href="/">로고</a>
        </h1>
        <div className={style.gnb}>
          <div className={style.logoff}>
            <a href="/login">로그인</a>
            <a href="/singup">회원가입</a>
          </div>
          <div className={style.logon}>
            <div className={style.profileImg}>
              <a href="#">
                <img src="" alt="프로필 이미지" />
              </a>
            </div>
            <div className={style.toggleMenu}>
              <a href="#">로그아웃</a>
              <a href="#">마이페이지</a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
