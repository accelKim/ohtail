import React from 'react';
import style from '../../styles/recipe/RecipeList.module.css';

const Pagination = ({ itemsPerPage, totalItems, currentPage, handleClick }) => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
        pageNumbers.push(
            <button
                key={i}
                onClick={() => handleClick(i)}
                className={currentPage === i ? style.active : ''}
            >
                {i}
            </button>
        );
    }

    return (
        <div className={style.recipe_pagination_wrap}>
            <div className={style.recipe_pagination}>
                {pageNumbers}
            </div>
        </div>
    );
};

export default Pagination;
