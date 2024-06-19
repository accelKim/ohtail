import React, { useState } from 'react';
import style from '../../styles/feed/CreateFeed.module.css';

const CreateFeed = () => {
  const [title, setTitle] = useState('');
  const [imgFile, setImgFile] = useState('');
  const [content, setContent] = useState('');

  const createNewFeed = (e) => {
    e.preventDefault();
    if (title === '') {
      alert('제목을 입력하세요');
      document.getElementById('title').focus();
    }
    if (imgFile === '') {
      alert('이미지가 없습니다');
      document.getElementById('imgFile').focus();
    }
    if (content === '') {
      alert('내용을 입력하세요');
      document.getElementById('content').focus();
    }
  };

  const data = new FormData();
  data.set('title', title);

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
          value={imgFile}
          onChange={(e) => setImgFile(e.target.value)}
        />
        {/* <label id="imgFile">
          <div>파일 추가</div>
        </label> */}
        <div>
          <img src="" alt="업로드한 이미지가 보일 공간" />
        </div>
        <input
          type="text"
          placeholder="내용을 입력해주세요"
          id="content"
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button>업로드</button>
      </form>
    </div>
  );
};

export default CreateFeed;
