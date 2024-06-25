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

  const navigate = useNavigate();
  const { webzineId } = useParams();

  useEffect(async () => {
    const getWebzine = async () => {
      const res = await fetch(`${url}/webzineEdit/${webzineId}`);
      const result = await res.json();
      console.log(result);
    };
  }, [webzineId]);

  const writeNewWebzine = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.set('title', title);
    data.append('files', files[0]);
    data.append('content', content);

    const response = await fetch(`${url}/webzineEdit`, {
      method: 'PUT',
      boday: data,
      credentials: 'include',
    });
    if (response.ok) {
      navigate(`webzineDetail/${webzineId}`);
    }
  };

  return (
    <div className={`mw ${style.write}`}>
      <form onSubmit={writeNewWebzine}>
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
          required
          onChange={(e) => setFiles(e.target.files)}
        />
        <label htmlFor="content" hidden></label>
        <WebzineEditor content={content} setContent={setContent} />
        <button type="submit">수정</button>
      </form>
    </div>
  );
};

export default WebzineEdit;
