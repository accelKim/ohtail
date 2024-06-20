import React from 'react';

const Pagination = ({ itemsPerPage, totalItems, currentPage, handleClick }) => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
        pageNumbers.push(
            <button key={i} onClick={() => handleClick(i)}>
                {i}
            </button>
        );
    }

    return <div>{pageNumbers}</div>;
};

export default Pagination;
