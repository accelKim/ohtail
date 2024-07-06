import React, { useEffect, useState } from 'react';
import style from '../../styles/webzine/Webzine.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { url } from '../../store/ref';
import WebzineList from '../../components/webzine/WebzineList';
import WebzineLikeButton from '../../components/like/WebzineLikeButton';

const Webzine = () => {
  const userId = localStorage.getItem('userid');
  const [user, setUser] = useState(0);
  const [webzineList, setWebzineList] = useState([]);
  const [webzineData, setWebzineData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${url}/webzineList`)
      .then((res) => res.json())
      .then((data) => setWebzineList(data));
  }, []);

  const fetchWebzineData = async () => {
    try {
      const response = await fetch(`${url}/webzine`, {
        method: 'GET',
      });
      if (response.ok) {
        const data = await response.json();
        setWebzineData(data);
      } else {
        console.error('webzine area error');
      }
    } catch (error) {
      console.error('webzine area error', error);
    }
  };

  useEffect(() => {
    fetchWebzineData();
    setUser(userId);
  }, [userId]);

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
            {webzineData && webzineData.length > 0 ? (
              <>{webzineData[0].title}</>
            ) : (
              <>
                웹진 오테일
                <br />
                업데이트 중
              </>
            )}
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
            {user === '10' ? <Link to="/WebzineWrite">글쓰기</Link> : null}
          </div>
          <ul>
            {webzineList.map((webzine, i) => (
              <WebzineList key={i} webzine={webzine} closeMenu={closeMenu} />
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
      <div className={`mw ${style.contArea} ${style.likeBtn}`}>
        {webzineData && webzineData.length > 0 ? (
          <>
            <div>
              <h4>{webzineData[0].summary}</h4>
              {/* 추가된 이미지 태그 */}
              {webzineData[0].cover && (
                <img
                  src={`${url}/${webzineData[0].cover}`}
                  alt="Webzine Cover"
                />
              )}
              <div
                dangerouslySetInnerHTML={{ __html: webzineData[0].content }}
              ></div>
            </div>
            <div>
              <p>{webzineData[0].nickname}</p>
              <p>
                {new Date(webzineData[0].createdAt).toLocaleDateString(
                  'ko-KR',
                  {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }
                )}
              </p>
            </div>
            <WebzineLikeButton webzineId={webzineData[0]._id} userId={userId} />
          </>
        ) : (
          ''
        )}
      </div>
      <div className={style.noise}></div>
    </div>
  );
};

export default Webzine;
