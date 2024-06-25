import React, { useEffect, useState } from 'react';
import style from '../../styles/webzine/Webzine.module.css';
import { url } from '../../store/ref';
import { Link, useParams } from 'react-router-dom';
import WebzineList from '../../components/webzine/WebzineList';

const WebzineDetail = () => {
  const { webzineId } = useParams();
  const [webzineInfo, setWebzineInfo] = useState(null);

  useEffect(() => {
    fetch(`${url}/webzineDetail/${webzineId}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error('Webzine not found');
        }
      })
      .then((data) => {
        setWebzineInfo(data);
      })
      .catch((error) => {
        console.error('Error fetching webzine detail:', error);
      });
  }, [webzineId]);

  const userToken = localStorage.getItem('token');
  const [user, setUser] = useState(null);
  const [webzineList, setWebzineList] = useState([]);

  useEffect(() => {
    fetch(`${url}/webzineList`)
      .then((res) => res.json())
      .then((data) => setWebzineList(data));
  }, []);

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

  const date = new Date(webzineInfo?.createdAt);
  const writeDate = date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div id={`${style.webzine}`}>
      <header>
        <div className="mw">
          <button onClick={toggleMenu}>
            웹진
            <br />
            한눈에👀
          </button>
          <h3>{webzineInfo?.title}</h3>
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
          </div>
          <ul>
            {webzineList.map((webzine) => (
              <WebzineList
                key={webzine.id}
                webzine={webzine}
                closeMenu={closeMenu}
              />
            ))}
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
          <h4>{webzineInfo?.title}</h4>
          <div dangerouslySetInnerHTML={{ __html: webzineInfo?.content }}></div>
        </div>
        <div>
          <p>{webzineInfo?.nickname}</p>
          <p>{writeDate}</p>
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

export default WebzineDetail;
