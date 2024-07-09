import React, { useEffect, useState } from "react";
import style from "../../styles/webzine/WebzineMain.module.css";
import { url } from "../../store/ref";
import { useNavigate } from "react-router-dom";

const WebzineMain = () => {
  const [webzineData, setWebzineData] = useState(null);
  const navigate = useNavigate();

  const fetchWebzineData = async () => {
    try {
      const response = await fetch(`${url}/webzine`, {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        setWebzineData(data);
      } else {
        console.error("webzine area error");
      }
    } catch (error) {
      console.error("webzine area error", error);
    }
  };

  useEffect(() => {
    fetchWebzineData();
  }, []);

  const webzineClick = () => {
    navigate("/webzine");
  };

  return (
    <div className="mainWebzine" onClick={webzineClick}>
      {webzineData ? (
        <>
          <h2>{webzineData[0].title}</h2>
          <div
            dangerouslySetInnerHTML={{ __html: webzineData[0]?.content }}
          ></div>
          <p>
            {new Date(webzineData[0].createdAt).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <div>
            {webzineData[0].cover && (
              <img
                src={webzineData[0].cover}
                alt={webzineData[0].title}
                className={style.cover}
              />
            )}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default WebzineMain;
