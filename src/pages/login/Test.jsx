import { useEffect, useState } from 'react';
import style from '../../styles/signup/Login.module.css';
import { Link, useNavigate } from 'react-router-dom';

const Test = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({ properties: {} });
  const [token, setToken] = useState(localStorage.getItem('token'));
  const { nicknames = '', profile_image = '' } = userInfo.properties || {};
  console.log(userInfo);

  const getUserData = async (token) => {
    const response = await fetch(`https://kapi.kakao.com/v2/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    });
    const user = await response.json();
    setUserInfo(user, () => navigate('/'));
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await getUserData(token);
        } catch (err) {
          console.log(err);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
    };
    fetchData();
  }, [localStorage.getItem('token')]);

  const kakaoLogOut = () => {
    localStorage.removeItem('token');
    setUserInfo({ properties: {} });
    navigate('/');
  };

  return (
    <nav>
      {userInfo && Object.keys(userInfo.properties || {}).length === 0 ? (
        '로그인이 필요합니다.'
      ) : (
        <div>
          카카오 사용자 이름 {nicknames} /{' '}
          <img
            src={profile_image}
            alt=""
            style={{ width: '50px', height: '50px', borderRadius: '50%' }}
          />{' '}
          <button onClick={kakaoLogOut}>로그아웃</button>
        </div>
      )}
      <hr />
      <ul className={style.gnb}></ul>
    </nav>
  );
};

export default Test;
