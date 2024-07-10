import React, { useEffect, useState } from 'react';
import style from '../../styles/signup/Signup.module.css';
import axios from 'axios';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordcon, setPasswordcon] = useState('');
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
  const [emailAvailable, setEmailAvailable] = useState(null);
  const [isEmailChecked, setIsEmailChecked] = useState(false); // 이메일 중복 확인 상태 추가

  const [instructions, setInstructions] = useState('');
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
        'https://web-ohtail-ly8dqscw04c35e9c.sel5.cloudtype.app/api/check-email',
        { email }
      );
      alert(response.data.message); // 서버에서 반환하는 메시지를 alert로 출력
      setEmailAvailable(response.data.available);
      setIsEmailChecked(true); // 이메일 중복 확인 완료 시 상태 변경
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
        'https://web-ohtail-ly8dqscw04c35e9c.sel5.cloudtype.app/api/check-nickname',
        {
          nickname,
        }
      );
      alert(response.data.message);
    } catch (error) {
      console.error('Error checking nickname:', error);
      alert('서버 오류');
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!isEmailChecked) {
      alert('이메일 중복 확인을 먼저 해주세요.');
      return;
    }

    if (password !== passwordcon) {
      setErrMessage2('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    } else {
      setErrMessage2('');
    }
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setErrMessage3('유효하지 않은 이메일 주소입니다.');
      return;
    } else {
      setErrMessage3('');
    }
    const phonePattern = /^01[0-1, 7-9]\d{3,4}\d{4}$/;
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
      setErrMessage6('음주 빈도를 선택해주세요.');
      return;
    } else {
      setErrMessage6('');
    }
    if (!preferredIngredients) {
      setErrMessage7('선호하는 재료를 선택해주세요.');
      return;
    } else {
      setErrMessage7('');
    }
    if (!preferredAlcoholLevel) {
      setErrMessage8('선호하는 도수를 선택해주세요.');
      return;
    } else {
      setErrMessage8('');
    }

    try {
      const response = await axios.post(
        'https://web-ohtail-ly8dqscw04c35e9c.sel5.cloudtype.app/api/signup',
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
        {errMessage3 && <div className={style.errorMessage}>{errMessage3}</div>}

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
          type="text"
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
        {errMessage6 && <div className={style.errorMessage}>{errMessage6}</div>}

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
        {errMessage7 && <div className={style.errorMessage}>{errMessage7}</div>}

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
        {errMessage8 && <div className={style.errorMessage}>{errMessage8}</div>}

        <button type="submit" disabled={!emailAvailable}>
          회원가입
        </button>
      </form>
    </div>
  );
};

export default Signup;
