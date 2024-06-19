import React, { useState } from 'react';
import style from '../../styles/feed/CreateFeed.module.css';

const CreateFeed = () => {
  const [title, setTitle] = useState('');
  const [imgFile, setImgFile] = useState('');
  const [content, setContent] = useState('');

  const data = new FormData();
  data.set('title', title);

  return (
    <div className={style.wrap}>
      <form className={style.createFeed}>
        <input
          type="text"
          placeholder="제목을 입력해주세요"
          id="title"
          name="title"
        />
        <input type="file" id="imgFile" name="imgFile" />
        {/* <label id="imgFile">
          <div>파일 추가</div>
        </label> */}
        <div>
          <img src="" alt="" />
        </div>
        <input
          type="text"
          placeholder="내용을 입력해주세요"
          id="content"
          name="content"
        />
        <button>업로드</button>
      </form>
    </div>
  );
};

export default CreateFeed;
