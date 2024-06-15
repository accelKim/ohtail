import { useState } from "react";
import style from "../../styles/myRecipe/CreateMyRecipe.module.css";
import { useNavigate } from "react-router-dom";

const CreateMyRecipe = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [ingredients, setIngredients] = useState([
    { name: "", quantity: "", unit: "옵션1" },
  ]);
  const [instructions, setInstructions] = useState("");
  const navigate = useNavigate();

  // 이미지 추가 함수
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    if (files.length + newFiles.length <= 3) {
      setFiles([...files, ...newFiles]);
    } else {
      alert("이미지는 최대 3장까지만");
    }
  };

  // 이미지 제거 함수
  const handleRemoveFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  // 재료 입력 함수
  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  // 재료 필드 추가 함수
  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "", unit: "옵션1" }]);
  };

  // 재료 필드 제거 함수
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

    // FormData
    const formData = new FormData();
    formData.set("title", title);
    formData.set("description", description);
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
    for (let i = 0; i < ingredients.length; i++) {
      formData.append(`ingredient_${i}_name`, ingredients[i].name);
      formData.append(`ingredient_${i}_quantity`, ingredients[i].quantity);
      formData.append(`ingredient_${i}_unit`, ingredients[i].unit);
    }
    formData.set("instructions", instructions);

    console.log({
      title,
      description,
      files,
      ingredients,
      instructions,
    });

    // 백엔드 전송 코드
    const response = await fetch("http://localhost:8080/createMyRecipe", {
      method: "POST",
      body: formData,
    });
    if (response.ok) {
      navigate("/");
    }
  };

  return (
    <main className="mw">
      <h2>나만의 레시피</h2>
      <form className={style.recipeCon} onSubmit={handleCreateRecipe}>
        <label htmlFor="title">칵테일 이름</label>
        <input
          type="text"
          name="title"
          id="title"
          className={style.inputField}
          placeholder="칵테일 이름"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label htmlFor="description">칵테일 소개</label>
        <input
          type="text"
          name="description"
          id="description"
          className={style.inputField}
          placeholder="칵테일 소개"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label htmlFor="files">이미지</label>
        <input
          type="file"
          name="files"
          accept="image/*"
          id="files"
          onChange={handleFileChange}
          multiple
        />
        <div className={style.imagePreview}>
          {files.map((file, index) => (
            <img
              key={index}
              src={URL.createObjectURL(file)}
              alt={`Preview ${index}`}
              onClick={() => handleRemoveFile(index)}
              className={style.previewImage}
            />
          ))}
        </div>

        <label htmlFor="ingredients">재료</label>
        {ingredients.map((ingredient, index) => (
          <div key={index}>
            <input
              type="text"
              name={`ingredient-name-${index}`}
              id={`ingredient-name-${index}`}
              placeholder="재료명"
              value={ingredient.name}
              onChange={(e) =>
                handleIngredientChange(index, "name", e.target.value)
              }
            />
            <input
              type="number"
              name={`ingredient-quantity-${index}`}
              id={`ingredient-quantity-${index}`}
              placeholder="수량"
              value={ingredient.quantity}
              onChange={(e) =>
                handleIngredientChange(index, "quantity", e.target.value)
              }
            />
            <select
              name={`ingredient-unit-${index}`}
              id={`ingredient-unit-${index}`}
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
              onClick={() => handleRemoveIngredient(index)}
              disabled={ingredients.length === 1}
            >
              제거
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddIngredient}>
          재료 추가
        </button>

        <label htmlFor="instructions">만드는 방법</label>
        <input
          name="instructions"
          id="instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />

        <button type="submit">레시피 등록</button>
      </form>
    </main>
  );
};

export default CreateMyRecipe;
