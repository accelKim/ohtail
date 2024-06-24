import React, { useState, useEffect } from 'react';
import style from '../../styles/feed/CreateFeed.module.css';
import { useNavigate } from 'react-router-dom';

const CreateFeed = () => {
  const [title, setTitle] = useState('');
  const [imgFile, setImgFile] = useState(null);
  const [content, setContent] = useState('');

  const navigate = useNavigate(); // useNavigate 훅 호출

  const createNewFeed = async (e) => {
    e.preventDefault();

    if (title === '') {
      alert('제목을 입력하세요');
      document.getElementById('title').focus();
      return;
    }
    if (!imgFile) {
      alert('이미지를 선택하세요');
      document.getElementById('imgFile').focus();
      return;
    }
    if (content === '') {
      alert('내용을 입력하세요');
      document.getElementById('content').focus();
      return;
    }

    const data = new FormData();
    data.append('title', title);
    data.append('imgFile', imgFile);
    data.append('content', content);

    try {
      const token = localStorage.getItem('token'); // 로컬 스토리지에서 토큰 가져오기

      const response = await fetch('http://localhost:8080/createFeed', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`, // Bearer 토큰 헤더 추가
        },
        body: data,
        credentials: 'include',
      });

      if (response.ok) {
        alert('피드가 성공적으로 생성되었습니다.');
        setTitle('');
        setImgFile(null);
        setContent('');
        navigate('/feed'); // 피드 목록 페이지로 네비게이션
      } else {
        throw new Error('피드 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error submitting the form:', error);
      alert('피드 생성에 실패했습니다...');
    }
  };

  return (
    <div className={style.wrap}>
      <form className={style.createFeed} onSubmit={createNewFeed}>
        <input
          type="text"
          placeholder="제목을 입력해주세요"
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="file"
          id="imgFile"
          name="imgFile"
          onChange={(e) => setImgFile(e.target.files[0])}
        />
        <div className={style.imgPreview}></div>
        <input
          type="text"
          placeholder="내용을 입력해주세요"
          id="content"
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">업로드</button>
      </form>
    </div>
  );
};

export default CreateFeed;
