import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import style from "../../styles/feed/CreateFeed.module.css";
const apiUrl = process.env.REACT_APP_API_URL
const FeedEdit = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [imgFile, setImgFile] = useState(null);
  const [imgPreviewUrl, setImgPreviewUrl] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${apiUrl}/api/feedDetail/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setTitle(data.title);
          setImgPreviewUrl(data.cover); // imgUrl -> cover 변경, 이미지 URL을 받아와서 미리보기에 표시
          setContent(data.content);
        } else {
          throw new Error("피드 정보를 가져오는데 실패했습니다.");
        }
      } catch (error) {
        console.error("Error fetching feed:", error);
        alert("피드 정보를 가져오는데 실패했습니다.");
      }
    };

    fetchFeed();
  }, [id]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImgFile(file);

      // 이미지 미리보기 설정
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageDelete = () => {
    setImgFile(null);
    setImgPreviewUrl(""); // 이미지 미리보기 초기화
  };

  const updateFeed = async (e) => {
    e.preventDefault();

    if (title === "") {
      alert("제목을 입력하세요");
      document.getElementById("title").focus();
      return;
    }
    if (!imgFile && !imgPreviewUrl) {
      // 이미지 파일과 미리보기 URL이 모두 없는 경우 체크
      alert("이미지를 선택하세요");
      document.getElementById("imgFile").focus();
      return;
    }
    if (content === "") {
      alert("내용을 입력하세요");
      document.getElementById("content").focus();
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("imgFile", imgFile);
    formData.append("content", content);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/feedEdit/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        toast.success("피드가 성공적으로 수정되었습니다.", {
          position: "bottom-center",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });
        setTimeout(() => {
          navigate(`/feedDetail/${id}`);
        }, 1000); // 1초 후에 페이지 이동
      } else {
        throw new Error("피드 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      alert("피드 수정에 실패했습니다.");
    }
  };

  return (
    <div className={style.wrap}>
      <form className={style.createFeed} onSubmit={updateFeed}>
        <input
          type="text"
          placeholder="제목을 입력해주세요"
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className={style.imgdiv}>
          <label htmlFor="imgFile" className={style.uploadLabel}>
            이미지 업로드
          </label>
          <input
            type="file"
            id="imgFile"
            name="imgFile"
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
        </div>
        <div className={style.imgPreview}>
          {imgPreviewUrl ? ( // 이미지 URL이 있는 경우 미리보기 표시
            <img src={imgPreviewUrl} alt="이미지 미리보기" />
          ) : (
            <span>이미지를 선택해 주세요</span>
          )}
          {imgPreviewUrl && ( // 이미지 URL이 있는 경우 삭제 버튼 표시
            <span className={style.deleteText} onClick={handleImageDelete}>
              x
            </span>
          )}
        </div>
        <input
          type="text"
          placeholder="내용을 입력해주세요"
          id="content"
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">수정하기</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default FeedEdit;
