import React, { Component } from "react";
import style from "../../styles/Main.module.css";

export class Main extends Component {
  render() {
    return (
      <main>
        <section className={`${style.mainVisual}`}>
          <div className={`${style.wave} ${style.one}`}></div>
          <div className={`${style.wave} ${style.two}`}></div>
          <div className={`${style.wave} ${style.three}`}></div>
          <div className={style.title}>
            Today's
            <br />
            Cocktail
            <br />
            Oh!tail
          </div>
        </section>
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
            더보기<i className="fa-solid fa-caret-right"></i>
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
            더보기<i className="fa-solid fa-caret-right"></i>
          </a>
        </section>
        <section className="mw">
          <div className="mainWebzine">
            <h2>웹진 오테일 1호</h2>
            <p>
              웹진 내용 웹진 내용 웹진 내용 웹진 내용 웹진 내용 웹진 내용 웹진
              내용 웹진 내용 웹진 내용 웹진 내용 웹진 내용 웹진 내용 웹진 내용
              웹진 내용 웹진 내용 웹진 내용 웹진 내용 웹진 내용{" "}
            </p>
            <p>2024년 6월</p>
          </div>
          <div className="mainFeed">
            <h2>피드</h2>
          </div>
        </section>
      </main>
    );
  }
}

export default Main;
