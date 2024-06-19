import React, { useEffect, useState } from 'react';
import style from '../styles/Header.module.css';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuOpen = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <header className={style.hd}>
      <div className="mw">
        <div
          onClick={menuOpen}
          className={`${style.ham} ${isOpen ? style.on : ''}`}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className={`${style.hamMenu} ${isOpen ? style.on : ''}`}>
          <a href="#">공식레시피</a>
          <a href="#">나만의레시피</a>
          <a href="/webzine">웹진</a>
          <a href="#">피드</a>
        </div>

        <h1>
          <a href="/">로고</a>
        </h1>
        <div className={style.gnb}>
          <div className={style.logoff}>
            <Link to="/login">로그인</Link>
            <Link to="/signup">회원가입</Link>
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
