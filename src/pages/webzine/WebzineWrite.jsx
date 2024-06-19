import React, { useState } from 'react';
import { url } from '../../store/ref';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import style from '../../styles/webzine/WebzineWrite.module.css';

const WebzineWrite = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const webzineSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(
        `${url}`,
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        navigate('/webzine');
      }
    } catch (error) {
      console.error('웹진 작성 오류:', error);
    }
  };
  return (
    <div className={`mw ${style.write}`}>
      <form onSubmit={webzineSubmit}>
        <input
          type="text"
          placeholder="웹진 타이틀을 입력해주세요."
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <ReactQuill value={content} onChange={setContent} />
        <button type="submit">글쓰기</button>
      </form>
    </div>
  );
};

export default WebzineWrite;
