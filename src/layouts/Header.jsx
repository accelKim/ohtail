import React, { useEffect, useState } from 'react';
import style from '../styles/Header.module.css';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  useEffect(() => {
    // 로컬 스토리지에서 userid를 가져와서 로그인 상태를 확인
    const userid = localStorage.getItem('userid');
    if (userid) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = isMenuOpen ? 'auto' : 'hidden';
  };

  const openProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
    document.body.style.overflow = isProfileMenuOpen ? 'auto' : 'hidden';
  };

  const handleLogout = () => {
    localStorage.removeItem('userid'); // 로컬 스토리지에서 userid 제거
    localStorage.removeItem('token'); // 로컬 스토리지에서 토큰 제거

    setIsLoggedIn(false); // 로그인 상태를 false로 변경
  };

  return (
    <header className={style.hd}>
      <div className="mw">
        <div
          onClick={toggleMenu}
          className={`${style.ham} ${isMenuOpen ? style.on : ''}`}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className={`${style.hamMenu} ${isMenuOpen ? style.on : ''}`}>
          <a href="/recipe">공식레시피</a>
          <a href="/myRecipe">나만의레시피</a>
          <a href="/webzine">웹진</a>
          <a href="/feed">피드</a>
        </div>

        <h1>
          <a href="/">로고</a>
        </h1>
        <div className={style.gnb}>
          {!isLoggedIn && (
            <div className={style.logoff}>
              <Link to="/login">로그인</Link>
              <Link to="/signup">회원가입</Link>
            </div>
          )}
          {isLoggedIn && (
            <div className={style.logon}>
              <div className={style.profileImg}>
                <a href="#" onClick={openProfileMenu}>
                  <img src="" alt="프로필 이미지" />
                </a>
              </div>
              {isProfileMenuOpen && (
                <div className={`${style.toggleMenu} ${style.profile}`}>
                  <a href="#" onClick={handleLogout}>
                    로그아웃
                  </a>
                  <a href="#">마이페이지</a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
