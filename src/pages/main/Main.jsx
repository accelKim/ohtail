import React, { Component } from 'react';
import style from '../../styles/Main.module.css';

export class Main extends Component {
  render() {
    return (
      <main>
        <section className="mainVisual">메인 비주얼 영역</section>
        <section className="mw mainRecipe">
          <h2>공식레시피</h2>
          <div className="imgArea">
            <a href="#">
              <img src="" alt="" />
            </a>
            <a href="#">
              <img src="" alt="" />
            </a>
            <a href="#">
              <img src="" alt="" />
            </a>
          </div>
          <a href="#" className="btnMore">
            더보기<i class="fa-solid fa-caret-right"></i>
          </a>
        </section>
        <section className="mw mainMyRecipe">
          <h2>나만의 레시피</h2>
          <div className="imgArea">
            <a href="#">
              <img src="" alt="" />
            </a>
            <a href="#">
              <img src="" alt="" />
            </a>
            <a href="#">
              <img src="" alt="" />
            </a>
            <a href="#">
              <img src="" alt="" />
            </a>
          </div>
          <a href="#" className="btnMore">
            더보기<i class="fa-solid fa-caret-right"></i>
          </a>
        </section>
        <section className="mw">
          <div className="mainWebzine">
            <h2>웹진 타이틀</h2>
            <p>
              웹진 내용 웹진 내용 웹진 내용 웹진 내용 웹진 내용 웹진 내용 웹진
              내용 웹진 내용 웹진 내용 웹진 내용 웹진 내용 웹진 내용 웹진 내용
              웹진 내용 웹진 내용 웹진 내용 웹진 내용 웹진 내용{' '}
            </p>
            <p>2024년 6월</p>
          </div>
          <div className="mainFeed">
            <h2>피드</h2>
            <div className="imgArea">
              <a href="#">
                <img src="" alt="" />
              </a>
              <a href="#">
                <img src="" alt="" />
              </a>
              <a href="#">
                <img src="" alt="" />
              </a>
              <a href="#">
                <img src="" alt="" />
              </a>
              <a href="#">
                <img src="" alt="" />
              </a>
              <a href="#">
                <img src="" alt="" />
              </a>
              <a href="#">
                <img src="" alt="" />
              </a>
              <a href="#">
                <img src="" alt="" />
              </a>
              <a href="#">
                <img src="" alt="" />
              </a>
            </div>
          </div>
        </section>
      </main>
    );
  }
}

export default Main;
