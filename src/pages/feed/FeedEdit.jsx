import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import style from '../../styles/feed/CreateFeed.module.css';

const FeedEdit = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [imgFile, setImgFile] = useState(null);
  const [imgPreviewUrl, setImgPreviewUrl] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/feedDetail/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setTitle(data.title);
          setImgPreviewUrl(data.imgUrl); // 이미지 URL을 받아와서 미리보기에 표시
          setContent(data.content);
        } else {
          throw new Error('피드 정보를 가져오는데 실패했습니다.');
        }
      } catch (error) {
        console.error('Error fetching feed:', error);
        alert('피드 정보를 가져오는데 실패했습니다.');
      }
    };

    fetchFeed();
  }, [id]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImgFile(file);

      // 이미지 미리보기 설정
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageDelete = () => {
    setImgFile(null);
    setImgPreviewUrl(''); // 이미지 미리보기 초기화
  };

  const updateFeed = async (e) => {
    e.preventDefault();

    if (title === '') {
      alert('제목을 입력하세요');
      document.getElementById('title').focus();
      return;
    }
    if (!imgFile && !imgPreviewUrl) {
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
        setImgPreviewUrl('');
        setContent('');
        navigate(`/feedDetail/${id}`);
      } else {
        throw new Error('피드 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error submitting the form:', error);
      alert('피드 수정에 실패했습니다.');
    }
  };

  return (
    <div className={style.wrap}>
      <form className={style.createFeed} onSubmit={updateFeed}>
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
          <input
            type="file"
            id="imgFile"
            name="imgFile"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
        </div>
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
        <button type="submit">수정하기</button>
      </form>
    </div>
  );
};

export default FeedEdit;
