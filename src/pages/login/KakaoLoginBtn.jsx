import React from 'react';

const KakaoLoginButton = () => {
  const REACT_APP_KAKAO_JS_KEY = process.env.REACT_APP_KAKAO_JS_KEY;
  const REDIRECT_URL = 'http://localhost:3000/oauth'; // 개발 환경에서 사용하는 리다이렉트 URI
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
