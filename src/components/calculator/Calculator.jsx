import React, { useState } from 'react';
import style from '../../styles/calculator/calculator.module.css'
const Calculator = () => {
    const [ingredients, setIngredients] = useState([{ name: '', volume: '', abv: '' }]);
    const [totalABV, setTotalABV] = useState(null);

    const handleInputChange = (index, event) => {
        const { name, value } = event.target;
        const newIngredients = [...ingredients];
        newIngredients[index][name] = value;
        setIngredients(newIngredients);
    };

    const handleAddIngredient = () => {
        setIngredients([...ingredients, { name: '', volume: '', abv: '' }]);
    };

    const handleRemoveIngredient = (index) => {
        const newIngredients = ingredients.filter((_, i) => i !== index);
        setIngredients(newIngredients);
    };

    const calculateABV = () => {
        const totalVolume = ingredients.reduce((acc, ingredient) => acc + parseFloat(ingredient.volume || 0), 0);
        const totalAlcohol = ingredients.reduce(
            (acc, ingredient) => acc + (parseFloat(ingredient.volume || 0) * parseFloat(ingredient.abv || 0)) / 100,
            0
        );
        const result = (totalAlcohol / totalVolume) * 100;
        setTotalABV(totalVolume > 0 ? result.toFixed(2) : '0.00');
    };

    return (
        <div>
            <h2>칵테일 도수 계산기</h2>
            {ingredients.map((ingredient, index) => (
                <div key={index} className={style.calculator_input_wrap}>
                    <input
                        type="text"
                        name="name"
                        value={ingredient.name}
                        onChange={(e) => handleInputChange(index, e)}
                        placeholder="재료명"
                    />
                    <input
                        type="number"
                        name="volume"
                        value={ingredient.volume}
                        onChange={(e) => handleInputChange(index, e)}
                        placeholder="양 (ml)"
                    />
                    <input
                        type="number"
                        name="abv"
                        value={ingredient.abv}
                        onChange={(e) => handleInputChange(index, e)}
                        placeholder="도수 (%)"
                    />
                    <button onClick={() => handleRemoveIngredient(index)}>재료 제거</button>
                </div>
            ))}
            <button onClick={handleAddIngredient}>재료 추가</button>
            <button onClick={calculateABV}>도수 계산</button>
            {totalABV !== null && (
                <div className={style.calculator_result_wrap}>
                    <h3>칵테일 도수: <span>{totalABV}</span>%</h3>
                </div>
            )}
        </div>
    );
};

export default Calculator;
