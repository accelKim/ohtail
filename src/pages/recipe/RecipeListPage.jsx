import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from '../../components/recipe/SearchBar';
import CategorySelect from '../../components/recipe/CategorySelect';
import RecipeList from '../../components/recipe/RecipeList';
import Pagination from '../../components/pagination/Pagination';
import style from '../../styles/recipe/RecipeList.module.css';

const RecipeListPage = () => {
  const [degreeOptions, setDegreeOptions] = useState([]);
  const [glassOptions, setGlassOptions] = useState([]);
  const [ingredientOptions, setIngredientOptions] = useState([]);
  const [alcoholicOptions, setAlcoholicOptions] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [initialRecipes, setInitialRecipes] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const degreeResponse = await axios.get(
          'https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list'
        );
        const glassResponse = await axios.get(
          'https://www.thecocktaildb.com/api/json/v1/1/list.php?g=list'
        );
        const ingredientResponse = await axios.get(
          'https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list'
        );
        const alcoholicResponse = await axios.get(
          'https://www.thecocktaildb.com/api/json/v1/1/list.php?a=list'
        );

        setDegreeOptions(
          degreeResponse.data.drinks.map((drink) => ({
            value: drink.strCategory,
            label: drink.strCategory,
          }))
        );
        setGlassOptions(
          glassResponse.data.drinks.map((drink) => ({
            value: drink.strGlass,
            label: drink.strGlass,
          }))
        );
        setIngredientOptions(
          ingredientResponse.data.drinks.map((drink) => ({
            value: drink.strIngredient1,
            label: drink.strIngredient1,
          }))
        );
        setAlcoholicOptions(
          alcoholicResponse.data.drinks.map((drink) => ({
            value: drink.strAlcoholic,
            label: drink.strAlcoholic,
          }))
        );
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    const fetchInitialRecipes = async () => {
      try {
        const response = await axios.get(
          'https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Alcoholic'
        );
        setInitialRecipes(response.data.drinks || []);
      } catch (error) {
        console.error('Error fetching initial recipes', error);
      }
    };

    fetchOptions();
    fetchInitialRecipes();
  }, []);

  const handleSearch = async (searchTerm, searchType) => {
    try {
      const response = await axios.get(
        `https://www.thecocktaildb.com/api/json/v1/1/search.php?${searchType}=${searchTerm}`
      );
      setSearchResults(response.data.drinks || []);
      setHasSearched(true);
      setCurrentPage(1); // Reset to the first page on new search
    } catch (error) {
      console.error('Error fetching search results', error);
    }
  };

  const handleFilterChange = async (filterType, selectedOption) => {
    let url = '';
    switch (filterType) {
      case 'ingredient':
        url = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${selectedOption.value}`;
        break;
      case 'glass':
        url = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?g=${selectedOption.value}`;
        break;
      case 'category':
        url = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${selectedOption.value}`;
        break;
      case 'alcoholic':
        url = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=${selectedOption.value}`;
        break;
      default:
        return;
    }

    try {
      const response = await axios.get(url);
      setSearchResults(response.data.drinks || []);
      setHasSearched(true);
      setCurrentPage(1); // Reset to the first page on new filter
    } catch (error) {
      console.error('Error fetching filtered results', error);
    }
  };

  const handleClick = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentResults = hasSearched
    ? searchResults.slice(indexOfFirstItem, indexOfFirstItem + itemsPerPage)
    : initialRecipes.slice(indexOfFirstItem, indexOfFirstItem + itemsPerPage);

  return (
    <div className={`mw ${style.recipe}`}>
      <SearchBar onSearch={handleSearch} />
      <CategorySelect
        degreeOptions={degreeOptions}
        glassOptions={glassOptions}
        ingredientOptions={ingredientOptions}
        alcoholicOptions={alcoholicOptions}
        onFilterChange={handleFilterChange}
      />
      <RecipeList
        searchResults={currentResults}
        hasSearched={hasSearched || initialRecipes.length > 0}
      />
      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={hasSearched ? searchResults.length : initialRecipes.length}
        currentPage={currentPage}
        handleClick={handleClick}
      />
    </div>
  );
};

export default RecipeListPage;
