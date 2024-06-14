import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import style from '../../styles/singup/Login.module.css';

const Login = () => {
  const [userid, setUserid] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const login = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (result.message === 'ok') {
        window.location.href = '/';
      } else if (result.message === 'nouser') {
        alert('사용자를 찾을 수 없습니다.');
      } else {
        alert('로그인 실패!');
      }
    } catch (error) {
      console.error('로그인 중 오류 발생:', error);
      alert('로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className={style.login}>
      <h2>로그인</h2>
      <form onSubmit={login}>
        <input
          type="email"
          placeholder="test@gmail.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button type="submit">로그인</button>
      </form>
      <div className={style.singupin}>
        <button>
          <Link to="/singup">회원가입</Link>
        </button>
      </div>
    </div>
  );
};

export default Login;
