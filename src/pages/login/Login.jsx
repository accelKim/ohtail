import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import style from '../../styles/signup/Login.module.css';
import KakaoLoginButton from './KakaoLoginBtn';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState(''); // nickname 상태 추가

  const loginWithEmail = async (e) => {
    e.preventDefault();
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
      console.log('서버 응답:', result); // 서버 응답 로그 추가

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
      <div className={style.singupin}>
        <button>
          <Link to="/signup">회원가입</Link>
        </button>
        <KakaoLoginButton />
      </div>
    </div>
  );
};

export default Login;
