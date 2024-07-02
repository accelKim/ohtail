import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import style from "../../styles/myRecipe/CreateMyRecipe.module.css";

const CreateMyRecipe = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [ingredients, setIngredients] = useState([
    {
      name: "",
      quantity: "",
      unit: "옵션1",
      translatedName: "",
      originalName: "",
      filteredOptions: [],
      originalOptions: [],
    },
  ]);
  const [instructions, setInstructions] = useState("");
  const [ingredientOptions, setIngredientOptions] = useState([]);
  const [translatedIngredientOptions, setTranslatedIngredientOptions] =
    useState([]);
  const navigate = useNavigate();
  const apiKey = process.env.REACT_APP_TRANSLATE_API_KEY;

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await fetch(
          "https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list"
        );
        const data = await response.json();
        const ingredientNames = data.drinks.map(
          (drink) => drink.strIngredient1
        );

        // Translate ingredient names
        const translatedOptions = await translateOptions(ingredientNames);

        setIngredientOptions(ingredientNames);
        setTranslatedIngredientOptions(translatedOptions);
      } catch (error) {
        console.error("Error fetching ingredient options:", error);
      }
    };

    fetchIngredients();
  }, []);

  const translateText = async (text) => {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: text,
          source: "en",
          target: "ko",
          format: "text",
        }),
      }
    );
    const data = await response.json();
    return data.data.translations[0].translatedText;
  };

  const translateOptions = async (options) => {
    const translatedOptions = await Promise.all(
      options.map((option) => translateText(option))
    );
    return translatedOptions;
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    if (files.length + newFiles.length <= 3) {
      setFiles([...files, ...newFiles]);
    } else {
      alert("이미지는 최대 3장까지만");
    }
  };

  const handleRemoveFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const handleAddIngredient = () => {
    setIngredients([
      ...ingredients,
      {
        name: "",
        quantity: "",
        unit: "옵션1",
        translatedName: "",
        originalName: "",
        filteredOptions: [],
        originalOptions: [],
      },
    ]);
  };

  const handleRemoveIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleCreateRecipe = async (e) => {
    e.preventDefault();
    if (title === "") {
      alert("칵테일 이름 필수!!!!!!!!!!");
      return;
    }

    if (description === "") {
      alert("칵테일 소개 필수!!!!!!!!!!");
      return;
    }

    if (files.length === 0) {
      alert("이미지 업로드 필수!!!!!!!!!!");
      return;
    }

    if (
      ingredients.some(
        (ingredient) =>
          ingredient.originalName === "" ||
          ingredient.quantity === "" ||
          ingredient.unit === ""
      )
    ) {
      alert("재료 필드 입력 필수!!!!!!!!!!");
      return;
    }

    if (instructions === "") {
      alert("만드는 방법 입력 필수!!!!!!!!!!");
      return;
    }

    const formData = new FormData();
    formData.set("title", title);
    formData.set("description", description);
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
    for (let i = 0; i < ingredients.length; i++) {
      formData.append(`ingredient_${i}_name`, ingredients[i].originalName);
      formData.append(`ingredient_${i}_quantity`, ingredients[i].quantity);
      formData.append(`ingredient_${i}_unit`, ingredients[i].unit);
    }
    formData.set("instructions", instructions);

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:8080/createMyRecipe", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (response.ok) {
        navigate("/myRecipe");
      }
    } catch (error) {
      console.error("Error creating recipe:", error);
      alert("레시피 생성 중 오류가 발생했습니다.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setInstructions(instructions + "\n");
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const handleNameFieldClick = (index) => {
    const newIngredients = [...ingredients];
    newIngredients[index].showOptions = !newIngredients[index].showOptions;
    newIngredients[index].filteredOptions = [];
    newIngredients[index].originalOptions = [];
    setIngredients(newIngredients);
  };

  const handleOptionClick = async (index, option, originalOption) => {
    const newIngredients = [...ingredients];
    newIngredients[index].originalName = originalOption;
    newIngredients[index].name = originalOption;
    newIngredients[index].showOptions = false;
    const translatedName = await translateText(originalOption);
    newIngredients[index].translatedName = translatedName;
    setIngredients(newIngredients);
  };

  const handleSearchChange = (e, index) => {
    const searchValue = e.target.value.toLowerCase();
    const filtered = translatedIngredientOptions.filter((option) =>
      option.toLowerCase().includes(searchValue)
    );
    const originalOptions = filtered.map((option) => {
      const originalIndex = translatedIngredientOptions.indexOf(option);
      return ingredientOptions[originalIndex];
    });
    const newIngredients = [...ingredients];
    newIngredients[index].filteredOptions = searchValue ? filtered : [];
    newIngredients[index].originalOptions = searchValue ? originalOptions : [];
    setIngredients(newIngredients);
  };

  return (
    <main className={`mw ${style.main}`}>
      <h2>나만의 레시피 등록🍸</h2>
      <form onSubmit={handleCreateRecipe} className={style.form}>
        <div className={style.titleCon}>
          <h3>칵테일 이름</h3>
          <input
            type="text"
            name="title"
            id="title"
            placeholder="칵테일 이름을 작성해주세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={style.titleInput}
          />
        </div>

        <div className={style.descCon}>
          <h3>칵테일 소개</h3>
          <input
            type="text"
            name="description"
            id="description"
            placeholder="칵테일 소개를 작성해주세요"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={style.descInput}
          />
        </div>
        <div className={style.imgUpload}>
          <h3>칵테일 이미지</h3>
          <button
            type="button"
            onClick={() => document.getElementById("files").click()}
            className={style.imgUploadBtn}
          >
            이미지 추가
          </button>
        </div>

        <input
          type="file"
          name="files"
          accept="image/*"
          id="files"
          onChange={handleFileChange}
          multiple
          className={style.fileInput}
        />
        <div className={style.imgPreview}>
          {[0, 1, 2].map((_, index) => (
            <div key={index} className={style.previewCon}>
              {files[index] ? (
                <img
                  src={URL.createObjectURL(files[index])}
                  alt={`Preview ${index}`}
                  onClick={() => handleRemoveFile(index)}
                  className={style.previewImg}
                />
              ) : (
                <div>이미지를 등록해주세요</div>
              )}
            </div>
          ))}
        </div>
        <div className={style.ingredientsCon}>
          <h3>재료 정보</h3>
          {ingredients.map((ingredient, index) => (
            <div key={index} className={style.ingredientsInput}>
              <div className={style.ingredients_name_Con}>
                <input
                  type="text"
                  name={`ingredient-name-${index}`}
                  id={`ingredient-name-${index}`}
                  placeholder="재료명"
                  value={ingredient.translatedName} // 번역된 이름을 표시
                  onClick={() => handleNameFieldClick(index)}
                  readOnly
                  className={style.ingredients_name}
                />
                {ingredient.showOptions && (
                  <div className={style.ingredients_name_dropMenu}>
                    <h3>재료 찾기</h3>
                    <input
                      type="text"
                      placeholder="찾으실 재료를 입력해주세요"
                      onChange={(e) => handleSearchChange(e, index)}
                      onKeyDown={handleSearchKeyDown}
                      className={style.ingredients_name_search}
                    />
                    {ingredient.filteredOptions.length > 0 &&
                      ingredient.filteredOptions.map((option, i) => (
                        <div
                          key={i}
                          onClick={() =>
                            handleOptionClick(
                              index,
                              option,
                              ingredient.originalOptions[i]
                            )
                          }
                          className={style.ingredients_name_list}
                        >
                          {option}
                        </div>
                      ))}
                  </div>
                )}
              </div>
              <div className={style.measureWrap}>
                <input
                  type="text"
                  onInput={(e) => {
                    e.target.value = e.target.value
                      .replace(/[^0-9.]/g, "")
                      .replace(/(\..*)\./g, "$1");
                  }}
                  name={`ingredient-quantity-${index}`}
                  id={`ingredient-quantity-${index}`}
                  placeholder="수량"
                  value={ingredient.quantity}
                  onChange={(e) =>
                    handleIngredientChange(index, "quantity", e.target.value)
                  }
                  className={style.ingredients_quantity}
                />
                <select
                  name={`ingredient-unit-${index}`}
                  id={`ingredient-unit-${index}`}
                  value={ingredient.unit}
                  onChange={(e) =>
                    handleIngredientChange(index, "unit", e.target.value)
                  }
                  className={style.ingredients_unit}
                >
                  <option value="옵션1">옵션1</option>
                  <option value="옵션2">옵션2</option>
                  <option value="옵션3">옵션3</option>
                </select>
                <button
                  type="button"
                  onClick={() => handleRemoveIngredient(index)}
                  disabled={ingredients.length === 1}
                  className={style.delIngredientBtn}
                >
                  제거
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddIngredient}
            className={style.addIngredientBtn}
          >
            재료 추가
          </button>
        </div>
        <div className={style.instructionCon}>
          <h3>만드는 방법</h3>
          <textarea
            name="instructions"
            id="instructions"
            placeholder="만드는 방법을 작성해주세요"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            onKeyDown={handleKeyDown}
            className={style.instructionInput}
          ></textarea>
        </div>
        <button type="submit" className={style.submitBtn}>
          업로드
        </button>
      </form>
    </main>
  );
};

export default CreateMyRecipe;
