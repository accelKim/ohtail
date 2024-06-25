import React, { useState } from 'react';
import { url } from '../../store/ref';
import style from '../../styles/webzine/WebzineWrite.module.css';
import WebzineEditor from './WebzineEditor';
import { useNavigate } from 'react-router-dom';

const WebzineWrite = () => {
  const userToken = localStorage.getItem('token'); // 추가 토큰 정보를 사용하려면 얘를 가지고 다녀야 함
  const [title, setTitle] = useState('');
  const [files, setFiles] = useState(null);
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const writeNewWebzine = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.set('title', title);
    data.append('files', files[0]);
    data.append('content', content);

    try {
      const response = await fetch(`${url}/webzineWrite`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        method: 'POST',
        body: data,
        credentials: 'include',
      });
      if (response.ok) {
        console.log('webzine write success');
        navigate('/webzine');
      } else {
        console.error('webzine write filed', response.statusText);
      }
    } catch (error) {
      console.error('webzine write error', error);
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
        <button type="submit">글쓰기</button>
      </form>
    </div>
  );
};

export default WebzineWrite;
