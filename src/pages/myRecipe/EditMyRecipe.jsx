import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import style from "../../styles/myRecipe/CreateMyRecipe.module.css";

const EditMyRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [removedFiles, setRemovedFiles] = useState([]);
  const [ingredients, setIngredients] = useState([
    {
      name: "",
      quantity: "",
      unit: "옵션1",
      showOptions: false,
      filteredOptions: [],
    },
  ]);
  const [instructions, setInstructions] = useState("");
  const [ingredientOptions, setIngredientOptions] = useState([]);
  const apiKey = process.env.REACT_APP_TRANSLATE_API_KEY;

  useEffect(() => {
    const fetchMyRecipe = async () => {
      try {
        const response = await fetch(`http://localhost:8080/myRecipe/${id}`);
        if (!response.ok) {
          throw new Error("레시피를 가져오는 중 오류 발생!!!!!");
        }
        const data = await response.json();
        setTitle(data.title);
        setDescription(data.description);
        setFiles(data.files);

        // 번역된 재료 이름 설정
        const translatedIngredients = await Promise.all(
          data.ingredients.map(async (ingredient) => ({
            ...ingredient,
            name: await translateText(ingredient.name),
            showOptions: false,
            filteredOptions: [],
          }))
        );
        setIngredients(translatedIngredients);
        setInstructions(data.instructions);
      } catch (error) {
        console.error("레시피를 가져오는 중 오류 발생!!!!!", error);
      }
    };

    fetchMyRecipe();
  }, [id]);

  useEffect(() => {
    const fetchAndTranslateIngredients = async () => {
      try {
        const response = await fetch(
          "https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list"
        );
        const data = await response.json();
        const ingredientNames = data.drinks.map(
          (drink) => drink.strIngredient1
        );

        const translatedNames = await Promise.all(
          ingredientNames.map(async (name) => await translateText(name))
        );

        setIngredientOptions(translatedNames);
      } catch (error) {
        console.error(
          "Error fetching and translating ingredient options:",
          error
        );
      }
    };

    fetchAndTranslateIngredients();
  }, []);

  const handleUpdateRecipe = async (e) => {
    e.preventDefault();
    if (title === "") {
      alert("칵테일 이름 필수!!!!!!!!!!");
      return;
    }

    if (description === "") {
      alert("칵테일 소개 필수!!!!!!!!!!");
      return;
    }

    if (files.length === 0 && newFiles.length === 0) {
      alert("이미지 업로드 필수!!!!!!!!!!");
      return;
    }

    if (
      ingredients.some(
        (ingredient) =>
          ingredient.name === "" ||
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

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.set("title", title);
    formData.set("description", description);
    newFiles.forEach((file) => {
      formData.append("files", file);
    });
    formData.set(
      "existingFiles",
      JSON.stringify(files.filter((file) => !removedFiles.includes(file)))
    );
    formData.set("removedFiles", JSON.stringify(removedFiles));
    ingredients.forEach((ingredient, index) => {
      formData.append(`ingredient_${index}_name`, ingredient.name);
      formData.append(`ingredient_${index}_quantity`, ingredient.quantity);
      formData.append(`ingredient_${index}_unit`, ingredient.unit);
    });
    formData.set("instructions", instructions);

    try {
      const response = await fetch(`http://localhost:8080/myRecipe/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        navigate(`/myRecipe/${id}`);
      } else {
        const errorData = await response.json();
        console.error("수정 요청 실패:", errorData);
        throw new Error(errorData.message || "수정 중 오류 발생!!!!!");
      }
    } catch (error) {
      console.error("수정 중 오류 발생!!!!!", error);
      alert(error.message);
    }
  };

  const handleFileChange = (e) => {
    const newAddedFiles = Array.from(e.target.files);
    if (newFiles.length + newAddedFiles.length <= 3) {
      setNewFiles([...newFiles, ...newAddedFiles]);
    } else {
      alert("이미지는 최대 3장까지만");
    }
  };

  const handleRemoveFile = (index, isExistingFile) => {
    if (isExistingFile) {
      const fileToRemove = files[index];
      setRemovedFiles([...removedFiles, fileToRemove]);
      setFiles(files.filter((_, i) => i !== index));
    } else {
      setNewFiles(newFiles.filter((_, i) => i !== index));
    }
  };

  const handleIngredientChange = async (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;

    if (field === "name") {
      const translatedName = await translateText(value);
      newIngredients[index].name = translatedName;
    }

    setIngredients(newIngredients);
  };

  const handleAddIngredient = () => {
    setIngredients([
      ...ingredients,
      {
        name: "",
        quantity: "",
        unit: "옵션1",
        showOptions: false,
        filteredOptions: [],
      },
    ]);
  };

  const handleRemoveIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setInstructions(instructions + "\n");
    }
  };

  const handleSearchChange = (e, index) => {
    const searchValue = e.target.value.toLowerCase();
    const filtered = ingredientOptions.filter((option) =>
      option.toLowerCase().includes(searchValue)
    );
    const newIngredients = [...ingredients];
    newIngredients[index].filteredOptions = filtered;
    setIngredients(newIngredients);
  };

  const handleNameFieldClick = (index) => {
    const newIngredients = [...ingredients];
    newIngredients[index].showOptions = true;
    newIngredients[index].filteredOptions = ingredientOptions;
    setIngredients(newIngredients);
  };

  const handleOptionClick = async (index, option) => {
    const newIngredients = [...ingredients];
    const translatedName = await translateText(option);
    newIngredients[index].name = translatedName;
    newIngredients[index].showOptions = false;
    setIngredients(newIngredients);
  };

  const translateText = async (text) => {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
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

  return (
    <main className={`mw ${style.main}`}>
      <h2>레시피 수정</h2>
      <form onSubmit={handleUpdateRecipe}>
        <label htmlFor="title"></label>
        <input
          type="text"
          name="title"
          id="title"
          className={style.title}
          placeholder="칵테일 이름을 작성해주세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label htmlFor="description"></label>
        <input
          type="text"
          name="description"
          id="description"
          className={style.desc}
          placeholder="칵테일 소개를 작성해주세요"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className={style.imageHeader}>
          <h3>칵테일 이미지</h3>
          <label htmlFor="files" className={style.fileUpload}>
            이미지 추가
          </label>
        </div>
        <input
          type="file"
          name="files"
          accept="image/*"
          id="files"
          onChange={handleFileChange}
          multiple
          style={{ display: "none" }}
        />
        <div className={style.imagePreview}>
          {[0, 1, 2].map((index) => (
            <div key={index} className={style.previewContainer}>
              {files[index] ? (
                <img
                  src={`http://localhost:8080/${files[index]}`}
                  alt={`Preview ${index}`}
                  onClick={() => handleRemoveFile(index, true)}
                  className={style.previewImage}
                />
              ) : newFiles[index] ? (
                <img
                  src={URL.createObjectURL(newFiles[index])}
                  alt={`Preview new ${index}`}
                  onClick={() => handleRemoveFile(index, false)}
                  className={style.previewImage}
                />
              ) : (
                <div className={style.placeholder}></div>
              )}
            </div>
          ))}
        </div>

        <h3>재료 정보</h3>
        {ingredients.map((ingredient, index) => (
          <div key={index} className={style.ingredientCon}>
            <input
              type="text"
              name={`ingredient-name-${index}`}
              id={`ingredient-name-${index}`}
              className={style.ingredientName}
              placeholder="재료명"
              value={ingredient.name}
              onChange={(e) =>
                handleIngredientChange(index, "name", e.target.value)
              }
              onClick={() => handleNameFieldClick(index)}
            />
            {ingredient.showOptions && (
              <div className={style.options}>
                <input
                  type="text"
                  placeholder="재료 검색"
                  onChange={(e) => handleSearchChange(e, index)}
                  className={style.searchInput}
                />
                {ingredient.filteredOptions.map((option, i) => (
                  <div
                    key={i}
                    className={style.option}
                    onClick={() => handleOptionClick(index, option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
            <input
              type="number"
              name={`ingredient-quantity-${index}`}
              id={`ingredient-quantity-${index}`}
              className={style.ingredientQuantity}
              placeholder="수량"
              value={ingredient.quantity}
              onChange={(e) =>
                handleIngredientChange(index, "quantity", e.target.value)
              }
            />
            <select
              name={`ingredient-unit-${index}`}
              id={`ingredient-unit-${index}`}
              className={style.ingredientUnit}
              value={ingredient.unit}
              onChange={(e) =>
                handleIngredientChange(index, "unit", e.target.value)
              }
            >
              <option value="옵션1">옵션1</option>
              <option value="옵션2">옵션2</option>
              <option value="옵션3">옵션3</option>
            </select>
            <button
              type="button"
              className={style.deletIngredient}
              onClick={() => handleRemoveIngredient(index)}
              disabled={ingredients.length === 1}
            >
              제거
            </button>
          </div>
        ))}
        <button
          type="button"
          className={style.addIngredientBtn}
          onClick={handleAddIngredient}
        >
          재료 추가
        </button>

        <h3>만드는 방법</h3>
        <textarea
          name="instructions"
          id="instructions"
          value={instructions}
          className={style.instructions}
          onChange={(e) => setInstructions(e.target.value)}
          onKeyDown={handleKeyDown}
        ></textarea>

        <button className={style.uploadBtn}>레시피 수정</button>
      </form>
    </main>
  );
};

export default EditMyRecipe;
