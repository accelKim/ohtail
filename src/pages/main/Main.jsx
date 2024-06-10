import React, { Component } from 'react';
import style from '../../styles/Main.module.css';

export class Main extends Component {
  render() {
    return (
      <main>
        <section className="mainVisual">메인 비주얼 영역</section>
        <section className="mw mainRecipe">
          <h2>공식레시피</h2>
        </section>
        <section className="mw mainMyRecipe">
          <h2>나만의 레시피</h2>
        </section>
        <section className="mw mainWebzine">
          <h2>웹진</h2>
        </section>
        <section className="mw mainFeed">
          <h2>나만의 레시피</h2>
        </section>
      </main>
    );
  }
}

export default Main;
