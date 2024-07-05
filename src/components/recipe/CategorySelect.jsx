import React, { useState } from 'react';
import Select from 'react-select';
import { useTranslation } from 'react-i18next';
import style from '../../styles/recipe/RecipeList.module.css';
const CategorySelect = ({ degreeOptions, glassOptions, ingredientOptions, alcoholicOptions, onFilterChange }) => {
    const { t } = useTranslation();

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedGlass, setSelectedGlass] = useState(null);
    const [selectedIngredient, setSelectedIngredient] = useState(null);
    const [selectedAlcoholic, setSelectedAlcoholic] = useState(null);

    const handleFilterChange = (filterType, selectedOption) => {
        setSelectedCategory(null);
        setSelectedGlass(null);
        setSelectedIngredient(null);
        setSelectedAlcoholic(null);

        switch (filterType) {
            case 'category':
                setSelectedCategory(selectedOption);
                break;
            case 'glass':
                setSelectedGlass(selectedOption);
                break;
            case 'ingredient':
                setSelectedIngredient(selectedOption);
                break;
            case 'alcoholic':
                setSelectedAlcoholic(selectedOption);
                break;
            default:
                break;
        }
        onFilterChange(filterType, selectedOption);
    };

    const translateOptions = (options) => {
        return options.map((option) => ({
            value: option.value,
            label: t(option.label),
        }));
    };

    return (
        <div className={style.category_wrap}>
            <Select
                className={style.category}
                options={translateOptions(degreeOptions)}
                value={selectedCategory}
                placeholder={t('Category')}
                onChange={(selectedOption) => handleFilterChange('category', selectedOption)}
            />
            <Select
                className={style.category}
                options={translateOptions(glassOptions)}
                value={selectedGlass}
                placeholder={t('Glass')}
                onChange={(selectedOption) => handleFilterChange('glass', selectedOption)}
            />
            <Select
                className={style.category}
                options={translateOptions(ingredientOptions)}
                value={selectedIngredient}
                placeholder={t('Ingredient')}
                onChange={(selectedOption) => handleFilterChange('ingredient', selectedOption)}
            />
            <Select
                className={style.category}
                options={translateOptions(alcoholicOptions)}
                value={selectedAlcoholic}
                placeholder={t('Alcoholic')}
                onChange={(selectedOption) => handleFilterChange('alcoholic', selectedOption)}
            />
        </div>
    );
};

export default CategorySelect;
