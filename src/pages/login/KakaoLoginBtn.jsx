import React from 'react';

const KakaoLoginButton = () => {
  const REACT_APP_KAKAO_JS_KEY = process.env.REACT_APP_KAKAO_JS_KEY;
  const REDIRECT_URL = 'https://port-0-ohserver-ly8dqscw04c35e9c.sel5.cloudtype.app/oauth';
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
