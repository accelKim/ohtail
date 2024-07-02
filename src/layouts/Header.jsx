import React, { useEffect, useState } from 'react';
import style from '../styles/Header.module.css';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(
    '/default_profile_image.jpg'
  );
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        // 일반 로그인인 경우
        setIsLoggedIn(true);
        const profileImageUrl = localStorage.getItem('profileImage');
        const storedNickname = localStorage.getItem('nickname');

        if (profileImageUrl) {
          setProfileImage(profileImageUrl);
        }
        if (storedNickname) {
          setNickname(storedNickname);
        }
      } else if (window.Kakao && window.Kakao.Auth) {
        // 카카오톡으로 로그인한 경우
        const accessToken = window.Kakao.Auth.getAccessToken();

        if (accessToken) {
          // Kakao API를 사용하여 사용자 정보를 가져옵니다.
          try {
            const response = await fetch('https://kapi.kakao.com/v2/user/me', {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-type':
                  'application/x-www-form-urlencoded;charset=utf-8',
              },
            });

            if (!response.ok) {
              throw new Error(
                '카카오 API로 사용자 정보를 가져오는 데 실패했습니다.'
              );
            }

            const user = await response.json();
            setProfileImage(user.properties.profile_image);
            setNickname(user.properties.nickname);
            setIsLoggedIn(true);

            // 사용자 정보를 가져온 후 페이지 새로고침
            window.location.reload();
          } catch (error) {
            console.error(
              '카카오 사용자 정보를 가져오는 중 오류가 발생했습니다:',
              error
            );
          }
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    checkLoggedIn();
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
            {/* 로고 이미지 추가 */}
            {/* <img src="" alt="로고" /> */}
          </Link>
        </h1>
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

export default Header;
