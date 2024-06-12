import React, { useEffect, useState } from 'react';
import style from '../../styles/webzine/Webzine.module.css';
import { Link } from 'react-router-dom';

const Webzine = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const toggleOption = (option) => {
    setSelectedOptions((prevOptions) => {
      if (prevOptions.includes(option)) {
        return prevOptions.filter((opt) => opt !== option);
      } else {
        return [...prevOptions, option];
      }
    });
  };

  useEffect(() => {
    const webzine = document.getElementById(style.webzine);
    webzine.className = `${style.webzine} ${selectedOptions
      .map((option) => style[option])
      .join(' ')}`;
  }, [selectedOptions]);

  return (
    <div id={`${style.webzine}`}>
      <header>
        <div className="mw">
          <button onClick={toggleMenu}>
            웹진
            <br />
            한눈에👀
          </button>
          <h3>
            웹진 오테일
            <br />
            1호(타이틀 영역)
          </h3>
          <Link to="/">
            웹진
            <br />
            닫기
          </Link>
        </div>
        <div className={`${style.listArea} ${isOpen ? style.on : ''}`}>
          <button onClick={closeMenu}>닫기</button>
          <ul>
            <li>
              <a href="#">게시글 제목 1</a>
            </li>
            <li>
              <a href="#">게시글 제목 22</a>
            </li>
            <li>
              <a href="#">게시글 제목 333</a>
            </li>
            <li>
              <a href="#">
                게시글 제목 4444 게시글 제목 4444 게시글 제목 4444 게시글 제목
                4444
              </a>
            </li>
            <li>
              <a href="#">게시글 제목 55555</a>
            </li>
            <li>
              <a href="#">게시글 제목 666666</a>
            </li>
            <li>
              <a href="#">게시글 제목 1</a>
            </li>
            <li>
              <a href="#">게시글 제목 22</a>
            </li>
            <li>
              <a href="#">게시글 제목 333</a>
            </li>
            <li>
              <a href="#">
                게시글 제목 4444 게시글 제목 4444 게시글 제목 4444 게시글 제목
                4444
              </a>
            </li>
            <li>
              <a href="#">게시글 제목 55555</a>
            </li>
            <li>
              <a href="#">게시글 제목 666666</a>
            </li>
            <li>
              <a href="#">게시글 제목 1</a>
            </li>
            <li>
              <a href="#">게시글 제목 22</a>
            </li>
            <li>
              <a href="#">게시글 제목 333</a>
            </li>
            <li>
              <a href="#">
                게시글 제목 4444 게시글 제목 4444 게시글 제목 4444 게시글 제목
                4444
              </a>
            </li>
            <li>
              <a href="#">게시글 제목 55555</a>
            </li>
            <li>
              <a href="#">게시글 제목 666666</a>
            </li>
          </ul>
        </div>
      </header>
      <div className="mw">
        <div className={style.optionArea}>
          <p>보기 옵션</p>
          <div>
            {['dark', 'large', 'small'].map((option) => (
              <p
                key={option}
                className={selectedOptions.includes(option) ? style.on : ''}
                onClick={() => toggleOption(option)}
              >
                {option === 'dark'
                  ? '어둡게'
                  : option === 'large'
                  ? '크게'
                  : '작게'}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Webzine;