import React, { useEffect, useState } from 'react';
import style from '../../styles/Header.module.css';
import { Link, useNavigate } from 'react-router-dom';

const HeaderUser = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(
    '/default_profile_image.jpg'
  );
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      const profileImageUrl = localStorage.getItem('profileImage');
      const storedNickname = localStorage.getItem('nickname');
      if (profileImageUrl) {
        setProfileImage(profileImageUrl);
      }
      if (storedNickname) {
        setNickname(storedNickname);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = isMenuOpen ? 'auto' : 'hidden';
  };

  const openProfileMenu = (e) => {
    e.preventDefault();
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleLogout = (e) => {
    e.preventDefault();

    // 로그아웃 관련 처리
    localStorage.removeItem('token');
    localStorage.removeItem('profileImage');
    localStorage.removeItem('nickname');

    setIsLoggedIn(false);
    setProfileImage('/default_profile_image.jpg');
    setNickname('');
    navigate('/');
  };

  const handleMenuLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={style.hd}>
      <div className="mw">
        <div className={style.gnb}>
          {!isLoggedIn ? (
            <div className={style.logoff}>
              <Link to="/login" onClick={handleMenuLinkClick}>
                로그인
              </Link>
              <Link to="/signup" onClick={handleMenuLinkClick}>
                회원가입
              </Link>
            </div>
          ) : (
            <div className={style.logon}>
              <div className={style.profileImg}>
                <a href="#" onClick={openProfileMenu}>
                  <img src={profileImage} alt="프로필 이미지" />
                </a>
              </div>
              {isProfileMenuOpen && (
                <div className={`${style.toggleMenu} ${style.profile}`}>
                  <a href="#" onClick={handleLogout}>
                    로그아웃
                  </a>
                  <Link to="/mypage" onClick={handleMenuLinkClick}>
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

export default HeaderUser;
