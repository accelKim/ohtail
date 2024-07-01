import React, { useEffect, useState } from "react";
import style from "../styles/Header.module.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const navigate = useNavigate();

  // useEffect 훅 수정
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      const profileImageUrl = localStorage.getItem("profileImage");
      if (profileImageUrl) {
        setProfileImage(profileImageUrl);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []); // isLoggedIn 상태가 변경될 때마다 useEffect 실행하지 않도록 수정

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = isMenuOpen ? "auto" : "hidden";
  };

  const openProfileMenu = (e) => {
    e.preventDefault();
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleLogout = (e) => {
    e.preventDefault();

    // Kakao SDK 로그아웃
    if (window.Kakao && window.Kakao.Auth) {
      window.Kakao.Auth.logout(function () {
        console.log("카카오 계정 로그아웃 완료");
      });
    }

    // 로컬 스토리지에서 관련 정보 제거
    localStorage.removeItem("userid");
    localStorage.removeItem("token");
    localStorage.removeItem("profileImage");
    localStorage.removeItem("nickname");

    // 상태 초기화 및 리디렉션
    setIsLoggedIn(false);
    setProfileImage("");
    navigate("/");
  };

  const handleMenuLinkClick = () => {
    setIsMenuOpen(false); // 메뉴 링크 클릭 시 메뉴 닫기
  };

  return (
    <header className={style.hd}>
      <div className="mw">
        <div
          onClick={toggleMenu}
          className={`${style.ham} ${isMenuOpen ? style.on : ""}`}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className={`${style.hamMenu} ${isMenuOpen ? style.on : ""}`}>
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
