import React, { useEffect, useState } from 'react';
import { url } from '../../store/ref';
import style from '../../styles/webzine/WebzineWrite.module.css';
import WebzineEditor from './WebzineEditor';
import { useNavigate, useParams } from 'react-router-dom';

const WebzineEdit = () => {
  const userToken = localStorage.getItem('token');

  const [title, setTitle] = useState('');
  const [files, setFiles] = useState(null);
  const [content, setContent] = useState('');
  const [cover, setCover] = useState('');

  const navigate = useNavigate();
  const { webzineId } = useParams();

  useEffect(() => {
    const getWebzine = async () => {
      const res = await fetch(`${url}/webzineEdit/${webzineId}`);
      const result = await res.json();
      console.log(result);
      setTitle(result.title);
      setContent(result.content);
      setCover(result.cover);
    };
    getWebzine();
  }, [webzineId]);

  const updateWebzine = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.set('title', title);
    if (files?.[0]) {
      data.set('files', files?.[0]);
    }
    data.append('content', content);

    const response = await fetch(`${url}/webzineEdit/${webzineId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
      body: data,
      credentials: 'include',
    });
    try {
      const result = await response.json();
      if (response.ok) {
        navigate(`/webzineDetail/${webzineId}`);
      } else {
        console.error('Failed to update webzine: ', result.message);
      }
    } catch (error) {
      console.error('Error parsing JSON: ', error);
    }
  };

  return (
    <div className={`mw ${style.write}`}>
      <form onSubmit={updateWebzine}>
        <label htmlFor="title" hidden></label>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="웹진 타이틀을 입력해주세요."
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          required
        />
        <label htmlFor="file" hidden>
          썸네일
        </label>
        <input
          type="file"
          id="files"
          name="files"
          onChange={(e) => setFiles(e.target.files)}
        />
        <p className={style.smallImgCon}>
          <img src={`${url}/${cover}`} alt={title} />
        </p>
        <label htmlFor="content" hidden></label>
        <WebzineEditor content={content} setContent={setContent} />
        <button type="submit">수정</button>
      </form>
    </div>
  );
};

export default WebzineEdit;
