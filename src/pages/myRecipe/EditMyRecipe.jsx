import React, { useEffect, useState, useRef } from "react";
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
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState("");
  const [ingredientOptions, setIngredientOptions] = useState([]);
  const [translatedIngredientOptions, setTranslatedIngredientOptions] =
    useState([]);
  const textareaRef = useRef(null);
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

        const ingredientsData = await Promise.all(
          data.ingredients.map(async (ingredient) => ({
            ...ingredient,
            originalName: ingredient.name,
            translatedName: await translateText(ingredient.name),
            showOptions: false,
            filteredOptions: [],
          }))
        );
        setIngredients(ingredientsData);
        setInstructions(data.instructions);
      } catch (error) {
        console.error("레시피를 가져오는 중 오류 발생!!!!!", error);
      }
    };

    fetchMyRecipe();
  }, [id]);

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

        // 재료 옵션 번역
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

  // 파일 변경 시 처리하는 함수
  const handleFileChange = (e) => {
    const newAddedFiles = Array.from(e.target.files);
    // 새로운 파일이 추가될 때, 기존 파일을 고려하여 최대 3개까지 추가
    if (files.length + newFiles.length + newAddedFiles.length <= 3) {
      setNewFiles([...newFiles, ...newAddedFiles]);
    } else {
      alert("칵테일 이미지 업로드는 최대 3장까지만 가능합니다");
    }
  };

  // 파일 제거 처리하는 함수
  const handleRemoveFile = (index, isExistingFile) => {
    if (isExistingFile) {
      const fileToRemove = files[index];
      setRemovedFiles([...removedFiles, fileToRemove]);
      setFiles(files.filter((_, i) => i !== index));
    } else {
      setNewFiles(newFiles.filter((_, i) => i !== index));
    }
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
        unit: "",
        translatedName: "",
        originalName: "",
        showOptions: false,
        filteredOptions: [],
        originalOptions: [],
      },
    ]);
  };

  const handleRemoveIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleUpdateRecipe = async (e) => {
    e.preventDefault();
    if (title === "") {
      alert("칵테일 이름을 입력해주세요");
      return;
    }

    if (description === "") {
      alert("칵테일 소개를 입력해주세요");
      return;
    }

    if (files.length === 0 && newFiles.length === 0) {
      alert("칵테일 이미지는 최소 1장이 필요합니다");
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
      alert("재료를 입력해주세요");
      return;
    }

    if (instructions === "") {
      alert("만드는 방법을 입력해주세요");
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
      formData.append(`ingredient_${index}_name`, ingredient.originalName);
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

  const handleSearchChange = async (e, index) => {
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
  const handleChangeTitle = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 30) {
      setTitle(inputValue);
    }
  };

  const handleChangeDesc = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 100) {
      setDescription(inputValue);
    }
  };

  const handleChangeInstruct = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 200) {
      setInstructions(inputValue);
    }
    adjustTextareaHeight();
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [instructions]);

  return (
    <main className={`mw ${style.main}`}>
      <h2>나만의 레시피 수정🍸</h2>
      <form onSubmit={handleUpdateRecipe}>
        <div className={style.titleCon}>
          <h3>칵테일 이름</h3>
          <div className={style.inputWrapper}>
            <input
              type="text"
              name="title"
              id="title"
              placeholder="칵테일 이름을 작성해주세요"
              value={title}
              onChange={handleChangeTitle}
              maxLength={30}
              className={style.titleInput}
            />
            <div className={style.charCount}>{title.length}/30</div>
          </div>
        </div>

        <div className={style.descCon}>
          <h3>칵테일 소개</h3>
          <div className={style.inputWrapper}>
            <input
              type="text"
              name="description"
              id="description"
              placeholder="칵테일 소개를 작성해주세요"
              value={description}
              onChange={handleChangeDesc}
              maxLength={100}
              className={style.descInput}
            />
            <div className={style.charCount}>{description.length}/100</div>
          </div>
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
          {[0, 1, 2].map((index) => (
            <div key={index} className={style.previewCon}>
              {files[index] ? (
                <>
                  <img
                    src={`http://localhost:8080/${files[index]}`}
                    alt={`Preview ${index}`}
                    className={style.previewImg}
                  />
                  <i
                    className={`fa-solid fa-x ${style.removeIcon}`}
                    onClick={() => handleRemoveFile(index, true)}
                  ></i>
                </>
              ) : newFiles[index - files.length] ? (
                <>
                  <img
                    src={URL.createObjectURL(newFiles[index - files.length])}
                    alt={`Preview new ${index}`}
                    className={style.previewImg}
                  />
                  <i
                    className={`fa-solid fa-x ${style.removeIcon}`}
                    onClick={() =>
                      handleRemoveFile(index - files.length, false)
                    }
                  ></i>
                </>
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
                  value={ingredient.translatedName}
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
                  <option value="" disabled selected>
                    단위
                  </option>
                  <option value="ml">ml</option>
                  <option value="dash">dash</option>
                  <option value="tsp">tsp</option>
                  <option value="drops">drops</option>
                  <option value="gram">gram</option>
                  <option value="개">개</option>
                  <option value="slice">slice</option>
                  <option value="peel">peel</option>
                  <option value="leaves">leaves</option>
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
          <div className={style.inputWrapper}>
            <textarea
              name="instructions"
              id="instructions"
              placeholder="만드는 방법을 작성해주세요"
              value={instructions}
              onChange={handleChangeInstruct}
              maxLength={300}
              onKeyDown={handleKeyDown}
              className={style.instructionInput}
              ref={textareaRef}
            ></textarea>
            <div className={style.charCount_instruct}>
              {instructions.length}/300
            </div>
          </div>
        </div>
        <button type="submit" className={style.submitBtn}>
          업로드
        </button>
      </form>
    </main>
  );
};

export default EditMyRecipe;
