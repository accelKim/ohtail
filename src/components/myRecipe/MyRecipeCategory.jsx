import React from "react";
import Select from "react-select";
import style from "../../styles/myRecipe/MyRecipeList.module.css";

const MyRecipeCategory = ({ sortOption, onSortChange }) => {
  const sortOptions = [
    { value: "newest", label: "최신순" },
    { value: "mostLiked", label: "좋아요순" },
  ];

  const handleChange = (selectedOption) => {
    onSortChange(selectedOption.value);
  };

  return (
    <div className={style.category}>
      <Select
        value={sortOptions.find((option) => option.value === sortOption)}
        options={sortOptions}
        placeholder="정렬"
        onChange={handleChange}
      />
    </div>
  );
};

export default MyRecipeCategory;
