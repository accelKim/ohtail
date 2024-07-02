import React, { useEffect, useState, useRef } from 'react';
import style from '../styles/Header.module.css';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [profileImage, setProfileImage] = useState('');
  const [userInfo, setUserInfo] = useState({ properties: {} });
  const [token, setToken] = useState(localStorage.getItem('token'));
  const { nicknames = '', profile_image = '' } = userInfo.properties || {};

  const navigate = useNavigate();

  const menuRef = useRef(null); // 메뉴가 열려 있는 영역의 ref

  const getUserData = async (token) => {
    const response = await fetch(`https://kapi.kakao.com/v2/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    });
    const user = await response.json();
    setUserInfo(user);
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await getUserData(token);
          setIsLoggedIn(true);
        } catch (err) {
          console.log(err);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    document.addEventListener('click', closeProfileMenu); // document 클릭 이벤트 추가
    return () => {
      document.removeEventListener('click', closeProfileMenu); // 컴포넌트 언마운트 시 이벤트 리스너 제거
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const openProfileMenu = (e) => {
    e.preventDefault();
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const closeProfileMenu = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setIsProfileMenuOpen(false);
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();

    // 로그아웃 관련 처리
    localStorage.removeItem('token');
    localStorage.removeItem('profileImage');
    localStorage.removeItem('nickname');
    setUserInfo({ properties: {} });
    setIsLoggedIn(false);
    setProfileImage('/default_profile_image.jpg');
    navigate('/');
  };

  const handleMenuLinkClick = () => {
    setIsMenuOpen(false);
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
          <Link to="/recipe" onClick={handleMenuLinkClick}>
            공식레시피
          </Link>
          <Link to="/myRecipe" onClick={handleMenuLinkClick}>
            나만의레시피
          </Link>
          <Link to="/webzine" onClick={handleMenuLinkClick}>
            웹진
          </Link>
          <Link to="/feed" onClick={handleMenuLinkClick}>
            피드
          </Link>
        </div>
        <h1>
          <Link to="/">
            {/* 이미지 추가 */}
            {/* <img src="" alt="" /> */}
          </Link>
        </h1>
        <div className={style.gnb}>
          {!isLoggedIn && (
            <div className={style.logoff}>
              <Link to="/login" onClick={handleMenuLinkClick}>
                로그인
              </Link>
              <Link to="/signup" onClick={handleMenuLinkClick}>
                회원가입
              </Link>
            </div>
          )}
          {isLoggedIn && (
            <div className={style.logon}>
              <div className={style.profileImg} ref={menuRef}>
                <a href="#" onClick={openProfileMenu}>
                  <img src={profile_image} alt="프로필 이미지" />
                </a>
              </div>
              {isProfileMenuOpen && (
                <div className={`${style.toggleMenu} ${style.profile}`}>
                  <a href="#" onClick={handleLogout}>
                    로그아웃
                  </a>
                  <Link to="/myPage" onClick={handleMenuLinkClick}>
                    마이페이지
                  </Link>
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
