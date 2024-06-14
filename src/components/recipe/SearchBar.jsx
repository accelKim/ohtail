import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('s');

    const handleSearch = () => {
        if (!searchTerm.trim()) {
            alert('검색어를 입력하세요.');
            return;
        }
        onSearch(searchTerm, searchType);
    };

    return (
        <div>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="검색어를 입력하세요"
            />
            <button onClick={handleSearch}>검색</button>
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
        </div>
    );
};

export default SearchBar;
