import React, { useEffect, useState } from 'react';
import style from '../../styles/webzine/Webzine.module.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { url } from '../../store/ref';

const Webzine = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState(() => {
    const savedOptions = localStorage.getItem('selectedOptions');
    return savedOptions ? JSON.parse(savedOptions) : [];
  });
  const [isAdmin, setIsAdmin] = useState(false); // 관리자 체크
  const [latestWebzine, setLatestWebzine] = useState(null); // 최근 작성된 글 상태 추가

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // JWT 토큰을 통해 관리자 여부 확인
      axios
        .get(`${url}/verifyToken`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setIsAdmin(response.data.isAdmin);
        })
        .catch((error) => {
          console.error('토큰 인증 오류: ', error);
        });
    }
  }, []);

  useEffect(() => {
    // 최근 작성된 글 가져오기
    axios
      .get(`${url}`)
      .then((response) => {
        setLatestWebzine(response.data[0]);
      })
      .catch((error) => {
        console.error('최근 글 가져오기 오류: ', error);
      });
  }, []);

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
          <h3>{latestWebzine ? latestWebzine.title : '웹진 오테일'}</h3>
          <Link to="/">
            웹진
            <br />
            닫기
          </Link>
        </div>
        <div className={`${style.listArea} ${isOpen ? style.on : ''}`}>
          <div>
            <button onClick={closeMenu}>닫기</button>
            <Link to="/WebzineWrite">글쓰기</Link>
            {/* {isAdmin && <Link to="/WebzineWrite.jsx">글쓰기</Link>} */}
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
          {/* 에디터 영역 */}
          <h4>웹진 오테일 1호</h4>
          <p>
            국민의 모든 자유와 권리는 국가안전보장·질서유지 또는 공공복리를
            위하여 필요한 경우에 한하여 법률로써 제한할 수 있으며, 제한하는
            경우에도 자유와 권리의 본질적인 내용을 침해할 수 없다.
          </p>
          <p>
            헌법에 의하여 체결·공포된 조약과 일반적으로 승인된 국제법규는
            국내법과 같은 효력을 가진다. 형사피의자 또는 형사피고인으로서
            구금되었던 자가 법률이 정하는 불기소처분을 받거나 무죄판결을 받은
            때에는 법률이 정하는 바에 의하여 국가에 정당한 보상을 청구할 수
            있다.
          </p>
          <p>
            대통령이 임시회의 집회를 요구할 때에는 기간과 집회요구의 이유를
            명시하여야 한다. 국회의원과 정부는 법률안을 제출할 수 있다. 국가는
            농지에 관하여 경자유전의 원칙이 달성될 수 있도록 노력하여야 하며,
            농지의 소작제도는 금지된다.
          </p>
          <p>
            공무원의 직무상 불법행위로 손해를 받은 국민은 법률이 정하는 바에
            의하여 국가 또는 공공단체에 정당한 배상을 청구할 수 있다. 이 경우
            공무원 자신의 책임은 면제되지 아니한다.
          </p>
          <p>
            국무총리는 국무위원의 해임을 대통령에게 건의할 수 있다. 국가는
            사회보장·사회복지의 증진에 노력할 의무를 진다. 대통령은
            국무총리·국무위원·행정각부의 장 기타 법률이 정하는 공사의 직을 겸할
            수 없다.
          </p>
          <p>
            공공필요에 의한 재산권의 수용·사용 또는 제한 및 그에 대한 보상은
            법률로써 하되, 정당한 보상을 지급하여야 한다. 국가는 과학기술의
            혁신과 정보 및 인력의 개발을 통하여 국민경제의 발전에 노력하여야
            한다.
          </p>
          <p>
            군인은 현역을 면한 후가 아니면 국무총리로 임명될 수 없다. 이 헌법은
            1988년 2월 25일부터 시행한다. 다만, 이 헌법을 시행하기 위하여 필요한
            법률의 제정·개정과 이 헌법에 의한 대통령 및 국회의원의 선거 기타 이
            헌법시행에 관한 준비는 이 헌법시행 전에 할 수 있다.
          </p>
          <p>
            혼인과 가족생활은 개인의 존엄과 양성의 평등을 기초로 성립되고
            유지되어야 하며, 국가는 이를 보장한다. 모든 국민은 건강하고 쾌적한
            환경에서 생활할 권리를 가지며, 국가와 국민은 환경보전을 위하여
            노력하여야 한다.
          </p>
          <p>
            위원은 정당에 가입하거나 정치에 관여할 수 없다. 대통령은 취임에
            즈음하여 다음의 선서를 한다. 제1항의 해임건의는 국회재적의원 3분의 1
            이상의 발의에 의하여 국회재적의원 과반수의 찬성이 있어야 한다.
          </p>
          <p>
            모든 국민은 법률이 정하는 바에 의하여 공무담임권을 가진다.
            중앙선거관리위원회는 대통령이 임명하는 3인, 국회에서 선출하는 3인과
            대법원장이 지명하는 3인의 위원으로 구성한다. 위원장은 위원중에서
            호선한다.
          </p>
          <p>
            지방의회의 조직·권한·의원선거와 지방자치단체의 장의 선임방법 기타
            지방자치단체의 조직과 운영에 관한 사항은 법률로 정한다. 국회의원은
            그 지위를 남용하여 국가·공공단체 또는 기업체와의 계약이나 그 처분에
            의하여 재산상의 권리·이익 또는 직위를 취득하거나 타인을 위하여 그
            취득을 알선할 수 없다.
          </p>
          <p>
            헌법재판소는 법률에 저촉되지 아니하는 범위안에서 심판에 관한 절차,
            내부규율과 사무처리에 관한 규칙을 제정할 수 있다. 제2항의 재판관중
            3인은 국회에서 선출하는 자를, 3인은 대법원장이 지명하는 자를
            임명한다.
          </p>
          <p>
            제1항의 탄핵소추는 국회재적의원 3분의 1 이상의 발의가 있어야 하며,
            그 의결은 국회재적의원 과반수의 찬성이 있어야 한다. 다만, 대통령에
            대한 탄핵소추는 국회재적의원 과반수의 발의와 국회재적의원 3분의 2
            이상의 찬성이 있어야 한다.
          </p>
          <p>
            국회나 그 위원회의 요구가 있을 때에는 국무총리·국무위원 또는
            정부위원은 출석·답변하여야 하며, 국무총리 또는 국무위원이 출석요구를
            받은 때에는 국무위원 또는 정부위원으로 하여금 출석·답변하게 할 수
            있다.
          </p>
          <p>
            이 헌법시행 당시에 이 헌법에 의하여 새로 설치될 기관의 권한에 속하는
            직무를 행하고 있는 기관은 이 헌법에 의하여 새로운 기관이 설치될
            때까지 존속하며 그 직무를 행한다.
          </p>
        </div>
        <div>
          <p>오테일</p>
          <p>2024-06-19</p>
        </div>
        <div>
          <button>수정</button>
          <button>삭제</button>
        </div>
        <button>0</button>
      </div>
      <div className={style.noise}></div>
    </div>
  );
};

export default Webzine;
