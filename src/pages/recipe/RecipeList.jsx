import { useState } from 'react';
import Select from 'react-select';
import style from '../../styles/recipe/RecipeList.module.css';
import Recipe from '../../components/recipe/Recipe';

const RecipeList = () => {
    const degreeOptions = [
        { value: '낮음', label: '낮음' },
        { value: '보통', label: '보통' },
        { value: '높음', label: '높음' },
    ];
    const baseOptions = [
        { value: 'vodka', label: '보드카' },
        { value: 'wiskey', label: '위스키' },
        { value: 'mint', label: '박하' },
    ];
    const sortOptions = [
        { value: 'popular', label: '인기순' },
        { value: 'views', label: '조회순' },
       
    ];
    return (
        <div className="mw">
            <input type="text" label=''/>
            <div className={style.category_wrap}>
                <Select options={degreeOptions} />
                <Select options={baseOptions} />
                <Select options={sortOptions} />
            </div>
            <Recipe />
        </div>
    );
};

export default RecipeList;
