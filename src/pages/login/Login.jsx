import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import style from '../../styles/signup/Login.module.css';
import KakaoLoginButton from './KakaoLoginBtn';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const loginWithEmail = async (e) => {
    e.preventDefault();

    // 아이디 또는 비밀번호가 입력되지 않은 경우 처리
    if (!email) {
      alert('아이디를 입력해주세요.');
      return;
    }

    if (!password) {
      alert('비밀번호를 입력해주세요.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('서버 응답:', result);

      if (result.message === '로그인 성공') {
        localStorage.setItem('userid', result.userid);
        localStorage.setItem('token', result.token);
        localStorage.setItem('nickname', result.nickname);

        alert('로그인 성공!');
        window.location.href = '/';
      } else if (result.message === '사용자를 찾을 수 없습니다.') {
        alert('사용자를 찾을 수 없습니다.');
      } else if (result.message === '비밀번호가 일치하지 않습니다.') {
        alert('비밀번호가 일치하지 않습니다.');
      } else if (result.message === '토큰 만료') {
        // 토큰 만료 처리
      } else {
        alert('로그인 실패!');
      }
    } catch (error) {
      console.error('로그인 중 오류 발생:', error);
      alert('로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className={`mw ${style.login}`}>
      <h2>로그인</h2>
      <form onSubmit={loginWithEmail}>
        <input
          type="email"
          placeholder="test@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">로그인</button>
      </form>
      <div className={style.signupin}>
        <div>
          {' '}
          <Link to="/signup" className={style.signupBtn}>
            회원가입
          </Link>
        </div>
        <KakaoLoginButton />
      </div>
    </div>
  );
};

export default Login;
