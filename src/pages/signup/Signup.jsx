import React, { useState } from 'react';
import style from '../../styles/signup/Signup.module.css';

const Signup = () => {
  const [userid, setUserid] = useState('');
  const [password, setPassword] = useState('');
  const [passwordcon, setPasswordcon] = useState('');
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [drinkingFrequency, setDrinkingFrequency] = useState('');
  const [preferredIngredients, setPreferredIngredients] = useState('');
  const [preferredAlcoholLevel, setPreferredAlcoholLevel] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const [errMessage2, setErrMessage2] = useState('');
  const [errMessage3, setErrMessage3] = useState('');
  const [errMessage4, setErrMessage4] = useState('');
  const [errMessage5, setErrMessage5] = useState('');
  const [errMessage6, setErrMessage6] = useState('');
  const [errMessage7, setErrMessage7] = useState('');
  const [errMessage8, setErrMessage8] = useState('');

  const onSubmit = async (e) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phonePattern = /^01[0-1, 7-9]\d{3,4}\d{4}$/;

    e.preventDefault();
    if (password !== passwordcon) {
      setErrMessage2('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    } else {
      setErrMessage2('');
    }
    if (!emailPattern.test(email)) {
      setErrMessage3('유효하지 않은 이메일 주소입니다.');
      return;
    } else {
      setErrMessage3('');
    }
    if (!phonePattern.test(phonenumber)) {
      setErrMessage4('유효하지 않은 휴대폰 번호입니다.');
      return;
    } else {
      setErrMessage4('');
    }
    if (!nickname) {
      setErrMessage5('닉네임을 입력해주세요.');
      return;
    } else {
      setErrMessage5('');
    }
    if (!drinkingFrequency) {
      setErrMessage6('음주빈도를 작성해주세요.');
      return;
    } else {
      setErrMessage6('');
    }
    if (!preferredIngredients) {
      setErrMessage7('선호하는 재료를 입력해주세요.');
      return;
    } else {
      setErrMessage7('');
    }
    if (!preferredAlcoholLevel) {
      setErrMessage8('선호하는 도수를 입력해주세요.');
      return;
    } else {
      setErrMessage8('');
    }
    try {
      const response = await fetch('http://localhost:8080/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          phonenumber,
          nickname,
          drinkingFrequency,
          preferredIngredients,
          preferredAlcoholLevel,
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
    <div className={`mw ${style.singup}`}>
      <h2>회원가입</h2>
      <form onSubmit={onSubmit}>
        <label>이메일</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
        />
        {errMessage3 && <div className={style.errorMessage}>{errMessage3}</div>}{' '}
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
        <label>휴대폰 번호</label>
        <input
          type="phonenumber"
          value={phonenumber}
          onChange={(e) => setPhonenumber(e.target.value)}
          required
        />
        {errMessage4 && <div className={style.errorMessage}>{errMessage4}</div>}
        <label>닉네임</label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
        />
        {errMessage5 && <div className={style.errorMessage}>{errMessage5}</div>}
        <label>음주 빈도</label>
        <input
          type="text"
          value={drinkingFrequency}
          onChange={(e) => setDrinkingFrequency(e.target.value)}
          required
        />
        {errMessage6 && <div className={style.errorMessage}>{errMessage6}</div>}
        <label>선호 재료</label>
        <input
          type="text"
          value={preferredIngredients}
          onChange={(e) => setPreferredIngredients(e.target.value)}
          required
        />
        {errMessage7 && <div className={style.errorMessage}>{errMessage7}</div>}
        <label>선호 도수</label>
        <input
          type="text"
          value={preferredAlcoholLevel}
          onChange={(e) => setPreferredAlcoholLevel(e.target.value)}
          required
        />
        {errMessage8 && <div className={style.errorMessage}>{errMessage8}</div>}
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
};

export default Signup;
