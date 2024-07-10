import React from 'react';
const apiUrl = process.env.REACT_APP_API_URL
const KakaoLoginButton = () => {
  const REACT_APP_KAKAO_JS_KEY = process.env.REACT_APP_KAKAO_JS_KEY;
  const REDIRECT_URL = `${apiUrl}/oauth`;
  const link = `https://kauth.kakao.com/oauth/authorize?client_id=${REACT_APP_KAKAO_JS_KEY}&redirect_uri=${REDIRECT_URL}&response_type=code`;

  const handleKakaoLogin = () => {
    window.location.href = link;
  };

  return (
    <div className="App">
      <button onClick={handleKakaoLogin}>카카오톡으로 로그인</button>
    </div>
  );
};

export default KakaoLoginButton;
