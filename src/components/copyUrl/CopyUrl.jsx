// src/CopyUrlButton.js
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import style from "../../styles/copyUrl/CopyUrl.module.css";

const CopyUrlButton = () => {
  const copyToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(
      () => {
        toast.success("클립 보드에 복사되었습니다", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });
      },
      (err) => {
        console.error("클립 보드 복사 실패: ", err);
      }
    );
  };

  return (
    <div>
      <button onClick={copyToClipboard}>공유하기</button>
      <ToastContainer />
    </div>
  );
};

export default CopyUrlButton;
