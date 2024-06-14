import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../../components/pagination/Pagination';
import style from '../../styles/recipe/Recipe.module.css';

const Recipe = () => {
    const [cocktails, setCocktails] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    useEffect(() => {
        fetch('https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Alcoholic')
            .then((response) => response.json())
            .then((data) => {
                setCocktails(data.drinks);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    const handleClick = (page) => {
        setCurrentPage(page);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCocktails = cocktails.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div>
            <ul>
                {currentCocktails.map((cocktail) => (
                    <li key={cocktail.idDrink}>
                        <Link to={`/recipe/${cocktail.idDrink}`}>{cocktail.strDrink}</Link>
                        <img src={cocktail.strDrinkThumb} alt="" />
                    </li>
                ))}
            </ul>
            <Pagination
                itemsPerPage={itemsPerPage}
                totalItems={cocktails.length}
                currentPage={currentPage}
                handleClick={handleClick}
            />
        </div>
    );
};

export default Recipe;
