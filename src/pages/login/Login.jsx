import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import style from '../../styles/Login.module.css';

const Login = () => {
  const [userID, setUserID] = useState('');
  const [userPassword, setUserPassword] = useState('');
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
          value={userID}
          onChange={(e) => {
            setUserID(e.target.value);
          }}
        />
        <input
          type="text"
          placeholder="Password"
          value={userPassword}
          onChange={(e) => {
            setUserPassword(e.target.value);
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
