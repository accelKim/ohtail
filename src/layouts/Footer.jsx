import React from 'react';
import style from '../styles/Footer.module.css';

const Footer = () => {
  return (
    <footer className={style.ft}>
      <div className="mw">
        <div>&copy;2024</div>
        <div>권민정 김소연 김원호 설예지</div>
      </div>
    </footer>
  );
};

export default Footer;
