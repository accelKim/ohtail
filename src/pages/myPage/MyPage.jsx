import React, { useState } from "react";
import FavoritesTab from "./tabs/FavoritesTab";
import MyRecipeTab from "./tabs/MyRecipeTab";
import FeedsTab from "./tabs/FeedsTab";
import CommentsTab from "./tabs/CommentsTab";

const MyPage = () => {
  const [activeTab, setActiveTab] = useState("favorites"); // 진입 시 디폴트 탭

  const renderTabContent = () => {
    switch (activeTab) {
      case "favorites":
        return <FavoritesTab />;
      case "myRecipes":
        return <MyRecipeTab />;
      case "feeds":
        return <FeedsTab />;
      case "comments":
        return <CommentsTab />;

      default:
        return null;
    }
  };

  return (
    <main className="mw">
      <h2>마이페이지</h2>
      <div className="tabs">
        <button onClick={() => setActiveTab("favorites")}>즐겨찾기</button>
        <button onClick={() => setActiveTab("myRecipes")}>내 레시피</button>
        <button onClick={() => setActiveTab("feeds")}>내 피드</button>
        <button onClick={() => setActiveTab("comments")}>내 댓글</button>
      </div>
      <div className="tab-content">{renderTabContent()}</div>
    </main>
  );
};

export default MyPage;
