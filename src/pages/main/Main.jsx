import React, { Component } from 'react';
import style from '../../styles/Main.module.css';
import MainPageRacipe from '../../components/recipe/MainPageRacipe';
import MainPageFeed from '../../components/feed/MainPageFeed';
import MainPageMyRecipe from '../../components/myRecipe/MainPageMyRecipe';
import WebzineMain from '../../components/webzine/WebzineMain';
import Calculator from "../../components/calculator/Calculator";
import { Link } from 'react-router-dom';
export class Main extends Component {
  render() {
    return (
      <main>
        <section className={`${style.mainVisual}`}>
          <div className={`${style.wave} ${style.one}`}></div>
          <div className={`${style.wave} ${style.two}`}></div>
          <div className={`${style.wave} ${style.three}`}></div>
          <div className={style.title}>
            <span>오</span>늘의
            <br />칵<span>테</span>일
            <br />
            오테<span>일</span>
          </div>
        </section>
        <section className="mw">
        <Calculator />
        </section>
        <section className="mw mainRecipe">
          <h2>공식레시피</h2>
          <MainPageRacipe />
          <Link to="/recipe" className="btnMore">
            더보기<i className="fa-solid fa-caret-right"></i>
          </Link>
        </section>
        <section className="mw mainMyRecipe">
          <h2>나만의 레시피</h2>
          <MainPageMyRecipe />
          <Link to="/myRecipe" className="btnMore">
            더보기<i className="fa-solid fa-caret-right"></i>
          </Link>
        </section>
        <section className="mw">
          <WebzineMain />
          <div className="mainFeed">
            <h2>피드</h2>
            <MainPageFeed />
          </div>
        </section>
      </main>
    );
  }
}

export default Main;
