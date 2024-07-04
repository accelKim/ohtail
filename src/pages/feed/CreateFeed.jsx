import React, { useState, useEffect } from 'react';
import style from '../../styles/feed/CreateFeed.module.css';
import { useNavigate } from 'react-router-dom';

const CreateFeed = () => {
  const [title, setTitle] = useState('');
  const [imgFile, setImgFile] = useState(null);
  const [imgPreviewUrl, setImgPreviewUrl] = useState(null);
  const [content, setContent] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (imgFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgPreviewUrl(reader.result);
      };
      reader.readAsDataURL(imgFile);
    } else {
      setImgPreviewUrl(null);
    }
  }, [imgFile]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImgFile(file);
    }
  };

  const handleImageDelete = () => {
    setImgFile(null);
    setImgPreviewUrl(null);
  };

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
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:8080/createFeed', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
        credentials: 'include',
      });

      if (response.ok) {
        alert('피드가 성공적으로 생성되었습니다.');
        setTitle('');
        setImgFile(null);
        setImgPreviewUrl(null);
        setContent('');
        navigate('/feed');
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
        <div className={style.imgdiv}>
          <label htmlFor="imgFile" className={style.uploadLabel}>
            이미지 업로드
          </label>
        </div>
        <input
          type="file"
          id="imgFile"
          name="imgFile"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />
        <div className={style.imgPreview}>
          {imgPreviewUrl ? (
            <img src={imgPreviewUrl} alt="이미지 미리보기" />
          ) : (
            <span>이미지를 선택해 주세요</span>
          )}
          {imgPreviewUrl && (
            <span className={style.deleteText} onClick={handleImageDelete}>
              x
            </span>
          )}
        </div>
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
