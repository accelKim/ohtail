import React, { useState } from 'react';
import style from '../../styles/singup/Singup.module.css';

const Singup = () => {
  const [userid, setUserid] = useState('');
  const [password, setPassword] = useState('');
  const [passwordcon, setPasswordcon] = useState('');
  const [errMessage, setErrMessage] = useState('');
  const [errMessage2, setErrMessage2] = useState('');

  const bcrypt = require('bcryptjs');
  var salt = bcrypt.genSaltSync(10);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!/^[a-zA-Z]+$/.test(userid)) {
      setErrMessage('아이디는 영어로만 작성해주세요.');
      return;
    } else {
      setErrMessage('');
    }

    if (password !== passwordcon) {
      setErrMessage2('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    } else {
      setErrMessage2('');
    }
    try {
      const response = await fetch('http://localhost:8080/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userid,
          password: bcrypt.hashSync(password, salt),
        }),
      });
      const data = await response.json();
      console.log('서버 응답:', data);
      if (response.status === 200) {
        window.location.href = '/login';
        //모달창 들어가야함
      } else {
        alert(data.message || '회원가입 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('회원가입 요청 오류:', error);
      alert('회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className={style.singup}>
      <h2>회원가입</h2>
      <form onSubmit={onSubmit}>
        <label>아이디</label>
        <input
          type="text"
          value={userid}
          onChange={(e) => setUserid(e.target.value)}
          required
        />
        {errMessage && <div className={style.errorMessage}>{errMessage}</div>}
        <label>비밀번호</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label>비밀번호 확인</label>
        <input
          type="password"
          value={passwordcon}
          onChange={(e) => setPasswordcon(e.target.value)}
          required
        />
        {errMessage2 && <div className={style.errorMessage}>{errMessage2}</div>}
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
};

export default Singup;
