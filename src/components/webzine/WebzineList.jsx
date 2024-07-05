import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WebzineList = ({ webzine, closeMenu }) => {
  const navigate = useNavigate();

  return (
    <li
      onClick={() => {
        navigate(`/webzineDetail/${webzine._id}`);
        closeMenu();
      }}
    >
      {webzine.summary}
    </li>
  );
};

export default WebzineList;
