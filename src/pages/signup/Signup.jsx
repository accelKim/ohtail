import React, { useEffect, useState } from 'react';
import style from '../../styles/signup/Signup.module.css';
import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordcon, setPasswordcon] = useState('');
  const [nickname, setNickname] = useState('');
  const [drinkingFrequency, setDrinkingFrequency] = useState('');
  const [preferredIngredients, setPreferredIngredients] = useState('');
  const [preferredAlcoholLevel, setPreferredAlcoholLevel] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const [errMessage, setErrMessage] = useState({
    email: '',
    password: '',
    phone: '',
    nickname: '',
    drinkingFrequency: '',
    ingredients: '',
    alcoholLevel: ''
  });
  const [emailAvailable, setEmailAvailable] = useState(null);
  const [isEmailChecked, setIsEmailChecked] = useState(false);

  const [ingredientOptions, setIngredientOptions] = useState([]);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await axios.get(
          'https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list'
        );
        const data = response.data;
        const ingredientNames = data.drinks.map(
          (drink) => drink.strIngredient1
        );

        setIngredientOptions(ingredientNames);
      } catch (error) {
        console.error('Error fetching ingredient options:', error);
      }
    };

    fetchIngredients();
  }, []);

  const handleEmailCheck = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/check-email`,
        { email }
      );
      alert(response.data.message); // 서버에서 반환하는 메시지를 alert로 출력
      setEmailAvailable(response.data.available);
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
        setEmail('');
      } else if (error.request) {
        console.error('No response received:', error.request);
        alert('서버 응답이 없습니다.');
      } else {
        console.error('Error setting up the request:', error.message);
        alert('요청을 설정하는 중 문제가 발생했습니다.');
      }
    }
  };

  const handleNicknameCheck = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/check-nickname`,
        { nickname }
      );
      alert(response.data.message);
    } catch (error) {
      console.error('Error checking nickname:', error);
      alert('서버 오류');
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form'); // 폼 제출 시 로그 확인

    setErrMessage({
      email: '',
      password: '',
      phone: '',
      nickname: '',
      drinkingFrequency: '',
      ingredients: '',
      alcoholLevel: ''
    });

    if (password !== passwordcon) {
      setErrMessage((prev) => ({ ...prev, password: '비밀번호와 비밀번호 확인이 일치하지 않습니다.' }));
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setErrMessage((prev) => ({ ...prev, email: '유효하지 않은 이메일 주소입니다.' }));
      return;
    }

    const phonePattern = /^01[0-1, 7-9]\d{3,4}\d{4}$/;
    if (!phonePattern.test(phonenumber)) {
      setErrMessage((prev) => ({ ...prev, phone: '유효하지 않은 휴대폰 번호입니다.' }));
      return;
    }

    if (!nickname) {
      setErrMessage((prev) => ({ ...prev, nickname: '닉네임을 입력해주세요.' }));
      return;
    }

    if (!drinkingFrequency) {
      setErrMessage((prev) => ({ ...prev, drinkingFrequency: '음주 빈도를 선택해주세요.' }));
      return;
    }

    if (!preferredIngredients) {
      setErrMessage((prev) => ({ ...prev, ingredients: '선호하는 재료를 선택해주세요.' }));
      return;
    }

    if (!preferredAlcoholLevel) {
      setErrMessage((prev) => ({ ...prev, alcoholLevel: '선호하는 도수를 선택해주세요.' }));
      return;
    }

    try {
      const response = await axios.post(
        `${apiUrl}/api/signup`,
        {
          email,
          password,
          phonenumber,
          nickname,
          drinkingFrequency,
          preferredIngredients,
          preferredAlcoholLevel,
        }
      );

      if (response.status === 200) {
        alert('회원가입 성공!');
        window.location.href = '/login';
      } else {
        alert(response.data.message || '회원가입 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('회원가입 요청 오류:', error);
      alert('회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className={`mw ${style.signup}`}>
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
        <button type="button" onClick={handleEmailCheck}>
          이메일 중복 확인
        </button>
        {errMessage.email && <div className={style.errorMessage}>{errMessage.email}</div>}

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
        {errMessage.password && <div className={style.errorMessage}>{errMessage.password}</div>}

        <label>휴대폰 번호</label>
        <input
          type="text"
          value={phonenumber}
          onChange={(e) => setPhonenumber(e.target.value)}
          required
        />
        {errMessage.phone && <div className={style.errorMessage}>{errMessage.phone}</div>}

        <label>닉네임</label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
        />
        <button type="button" onClick={handleNicknameCheck}>
          닉네임 중복 확인
        </button>
        {errMessage.nickname && <div className={style.errorMessage}>{errMessage.nickname}</div>}

        <label>음주 빈도</label>
        <select
          value={drinkingFrequency}
          onChange={(e) => setDrinkingFrequency(e.target.value)}
          required
        >
          <option value="">선택해주세요</option>
          <option value="rarely">1회~3회</option>
          <option value="occasionally">4회~6회</option>
          <option value="often">7회~10회</option>
          <option value="very_often">10회 이상</option>
        </select>
        {errMessage.drinkingFrequency && <div className={style.errorMessage}>{errMessage.drinkingFrequency}</div>}

        <label>선호 재료</label>
        <select
          value={preferredIngredients}
          onChange={(e) => setPreferredIngredients(e.target.value)}
          required
        >
          <option value="">선택해주세요</option>
          {ingredientOptions.map((ingredient) => (
            <option key={ingredient} value={ingredient}>
              {ingredient}
            </option>
          ))}
        </select>
        {errMessage.ingredients && <div className={style.errorMessage}>{errMessage.ingredients}</div>}

        <label>선호 도수</label>
        <select
          value={preferredAlcoholLevel}
          onChange={(e) => setPreferredAlcoholLevel(e.target.value)}
          required
        >
          <option value="">선택해주세요</option>
          <option value="low">낮음</option>
          <option value="medium">보통</option>
          <option value="high">높음</option>
        </select>
        {errMessage.alcoholLevel && <div className={style.errorMessage}>{errMessage.alcoholLevel}</div>}

        <button type="submit">회원가입</button>
      </form>
    </div>
  );
};

export default Signup;
