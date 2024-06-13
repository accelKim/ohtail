import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import style from '../../styles/singup/Login.module.css';

const Login = () => {
  const [userid, setUserid] = useState('');
  const [password, setPassword] = useState('');
  const login = (e) => {
    e.preventDefault();
  };

  return (
    <div className={style.login}>
      <h2>로그인</h2>
      <form>
        <input
          type="text"
          placeholder="ID"
          value={userid}
          onChange={(e) => {
            setUserid(e.target.value);
          }}
        />
        <input
          type="text"
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
