import React from 'react';
import style from '../../styles/feed/CreateFeed.module.css';

const CreateFeed = () => {
  return (
    <div className={style.wrap}>
      <form className={style.createFeed}>
        <input type="text" placeholder="제목을 입력해주세요" />
        <input type="file" id="imgFile" />
        <label id="imgFile">
          <div>파일 추가</div>
        </label>
        <div>
          <a href=""></a>{' '}
        </div>
        <input type="text" placeholder="내용을 입력해주세요" />
        <button>업로드</button>
      </form>
    </div>
  );
};

export default CreateFeed;
