import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const FeedEdit = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [imgFile, setImgFile] = useState(null);
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const updateFeed = async (e) => {
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

    const formData = new FormData();
    formData.append('title', title);
    formData.append('imgFile', imgFile);
    formData.append('content', content);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/feedEdit/${id}`, {
        method: 'PUT', // 또는 'PATCH'로 변경
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
        credentials: 'include',
      });

      if (response.ok) {
        alert('피드가 성공적으로 수정되었습니다.');
        setTitle('');
        setImgFile(null);
        setContent('');
        navigate(`/feed/${id}`);
      } else {
        throw new Error('피드 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error submitting the form:', error);
      alert('피드 수정에 실패했습니다.');
    }
  };

  return (
    <div className="wrap">
      <form className="createFeed" onSubmit={updateFeed}>
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
        <div className="imgPreview"></div>
        <input
          type="text"
          placeholder="내용을 입력해주세요"
          id="content"
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">수정하기</button>
      </form>
    </div>
  );
};

export default FeedEdit;
