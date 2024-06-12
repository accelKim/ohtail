import React, { useState } from 'react';
import style from '../../styles/Singup.module.css';

const Singup = () => {
  const [userID, setUserID] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userPasswordCon, setUserPasswordCon] = useState('');

  const singup = (e) => {
    e.preventDefault();
  };

  return (
    <div className={style.singup}>
      <h2>회원가입</h2>
      <form>
        <label>아이디</label>
        <input
          type="text"
          id="userID"
          value={userID}
          onChange={(e) => {
            setUserID(e.target.value);
          }}
          required
        />
        <label>비밀번호</label>
        <input
          type="password"
          id="userPassword"
          value={userPassword}
          onChange={(e) => {
            setUserPassword(e.target.value);
          }}
          required
        />
        <label>비밀번호 확인</label>
        <input
          type="password"
          id="userPasswordCon"
          value={userPasswordCon}
          onChange={(e) => {
            setUserPasswordCon(e.target.value);
          }}
          required
        />
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
};

export default Singup;
