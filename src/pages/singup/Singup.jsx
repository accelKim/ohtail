import React, { useState, useEffect } from 'react';
import axios from 'axios';
import style from '../../styles/singup/Singup.module.css';

const Singup = () => {
  const [userID, setUserID] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userPasswordCon, setUserPasswordCon] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({});

  const onSubmit = (e) => {
    e.preventDefault();
    if (userPassword !== userPasswordCon) {
      return alert('비밀번호와 비밀번호확인이 일치하지 않습니다.');
    }

    setFormData({ userID, userPassword });
    setSubmitted(true);
  };

  useEffect(() => {
    const submitForm = async () => {
      if (submitted) {
        try {
          const response = await axios.post(
            'http://localhost:5000/signup',
            formData
          );
          alert(response.data.message);
        } catch (error) {
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            alert(error.response.data.message);
          } else {
            alert('회원가입 중 오류가 발생했습니다.');
          }
        } finally {
          setSubmitted(false); // 요청 완료 후 상태를 리셋합니다.
        }
      }
    };

    submitForm();
  }, [submitted, formData]);

  return (
    <div className={style.singup}>
      <h2>회원가입</h2>
      <form onSubmit={onSubmit}>
        <label>아이디</label>
        <input
          type="text"
          id="userID"
          value={userID}
          onChange={(e) => setUserID(e.target.value)}
          required
        />
        <label>비밀번호</label>
        <input
          type="password"
          id="userPassword"
          value={userPassword}
          onChange={(e) => setUserPassword(e.target.value)}
          required
        />
        <label>비밀번호 확인</label>
        <input
          type="password"
          id="userPasswordCon"
          value={userPasswordCon}
          onChange={(e) => setUserPasswordCon(e.target.value)}
          required
        />
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
};

export default Singup;
