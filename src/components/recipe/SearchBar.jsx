import React, { useState } from 'react';

// Translate API 호출 함수
const translateText = async (text, targetLanguage = 'en') => {
    const apiKey = process.env.REACT_APP_TRANSLATE_API_KEY; // 여기에 API 키를 입력하세요.
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            q: text,
            target: targetLanguage,
        }),
    });

    const data = await response.json();
    return data.data.translations[0].translatedText;
};

const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('s');

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            alert('검색어를 입력하세요.');
            return;
        }

        try {
            const translatedTerm = await translateText(searchTerm);
            onSearch(translatedTerm, searchType);
        } catch (error) {
            console.error('번역 중 오류 발생:', error);
            alert('검색어 번역에 실패했습니다. 나중에 다시 시도하세요.');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div>
            <div>
                <label>
                    <input
                        type="radio"
                        name="searchType"
                        value="s"
                        checked={searchType === 's'}
                        onChange={() => setSearchType('s')}
                    />
                    칵테일 이름
                </label>
                <label>
                    <input
                        type="radio"
                        name="searchType"
                        value="i"
                        checked={searchType === 'i'}
                        onChange={() => setSearchType('i')}
                    />
                    재료 이름
                </label>
            </div>
            <div>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="검색어를 입력하세요"
                />
                <button onClick={handleSearch}>
                    <i className="fa-solid fa-magnifying-glass"></i>
                </button>
            </div>
        </div>
    );
};

export default SearchBar;
