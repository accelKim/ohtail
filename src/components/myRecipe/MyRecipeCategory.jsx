import React from "react";
import Select from "react-select";

const MyRecipeCategory = ({ sortOption, onSortChange }) => {
  const sortOptions = [
    { value: "newest", label: "최신순" },
    { value: "oldest", label: "오래된순" },
  ];

  const handleChange = (selectedOption) => {
    onSortChange(selectedOption.value);
  };

  return (
    <div>
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
