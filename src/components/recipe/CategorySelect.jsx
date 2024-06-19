import React from 'react';
import Select from 'react-select';

const CategorySelect = ({ degreeOptions, glassOptions, ingredientOptions, alcoholicOptions, onFilterChange }) => {
    return (
        <div className="category_wrap">
            <Select
                options={degreeOptions}
                placeholder="Category"
                onChange={(selectedOption) => onFilterChange('category', selectedOption)}
            />
            <Select
                options={glassOptions}
                placeholder="Glass"
                onChange={(selectedOption) => onFilterChange('glass', selectedOption)}
            />
            <Select
                options={ingredientOptions}
                placeholder="Ingredient"
                onChange={(selectedOption) => onFilterChange('ingredient', selectedOption)}
            />
            <Select
                options={alcoholicOptions}
                placeholder="Alcoholic"
                onChange={(selectedOption) => onFilterChange('alcoholic', selectedOption)}
            />
        </div>
    );
};

export default CategorySelect;
