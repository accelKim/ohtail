import React, { useEffect, useState } from 'react';
import style from '../../styles/webzine/Webzine.module.css';
import { Link } from 'react-router-dom';
import { url } from '../../store/ref';

const Webzine = () => {
  const userToken = localStorage.getItem('token');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (userToken) {
        try {
          const response = await fetch(`${url}/webzine`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${userToken}`,
              'Content-Type': 'application/json',
            },
          });
          if (response.ok) {
            const data = await response.json();
            setUser(data);
          } else {
            console.error('webzine area error');
          }
        } catch (error) {
          console.error('webzine area error', error);
        }
      }
    };
    fetchUser();
  }, [userToken]);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState(() => {
    const savedOptions = localStorage.getItem('selectedOptions');
    return savedOptions ? JSON.parse(savedOptions) : [];
  });

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const toggleOption = (option) => {
    setSelectedOptions((prevOptions) => {
      const sizeOptions = ['small', 'large'];

      let newOptions;
      if (prevOptions.includes(option)) {
        newOptions = prevOptions.filter((opt) => opt !== option);
      } else {
        if (sizeOptions.includes(option)) {
          newOptions = prevOptions
            .filter((opt) => !sizeOptions.includes(opt))
            .concat(option);
        } else {
          newOptions = [...prevOptions, option];
        }
      }

      localStorage.setItem('selectedOptions', JSON.stringify(newOptions));

      return newOptions;
    });
  };

  useEffect(() => {
    const webzine = document.getElementById(style.webzine);
    const classes = selectedOptions.map((option) => style[option]).join(' ');
    webzine.className = `${style.webzine} ${classes}`;
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
            1호
          </h3>
          <Link to="/">
            웹진
            <br />
            닫기
          </Link>
        </div>
        <div className={`${style.listArea} ${isOpen ? style.on : ''}`}>
          <div>
            <button onClick={closeMenu}>닫기</button>
            {user && user.userid === 10 && (
              <Link to="/WebzineWrite">글쓰기</Link>
            )}
            {/* 어떻게 야매로 글쓰기 버튼 노출은 일단 했는데... */}
          </div>
          <ul>
            <li>
              <a href="#">게시글 제목 1</a>
            </li>
          </ul>
        </div>
      </header>
      <div className="">
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
      <div className={`mw ${style.contArea}`}>
        <div>
          {/* 에디터 작성 내용 불러오는 영역 */}
          <h4>웹진 오테일 1호</h4>
          <p>
            국민의 모든 자유와 권리는 국가안전보장·질서유지 또는 공공복리를
            위하여 필요한 경우에 한하여 법률로써 제한할 수 있으며, 제한하는
            경우에도 자유와 권리의 본질적인 내용을 침해할 수 없다.
          </p>
        </div>
        <div>
          <p>오테일</p>
          <p>2024-06-19</p>
        </div>
        {user && user.userid === 10 && (
          <div>
            <Link to="/WebzineEdit">수정</Link>
            <Link to="">삭제</Link>
          </div>
        )}
        <button>0</button>
      </div>
      <div className={style.noise}></div>
    </div>
  );
};

export default Webzine;
