// components/SearchBar.js
import React, { useState, useEffect } from "react";
import { Box, IconButton, InputBase } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

/**
 * @param {function} onSearch - 검색어가 최종 확정됐을 때 호출되는 함수
 * @param {string} placeholder - 인풋의 placeholder 문구
 * @param {number} delay - 디바운스 지연 시간(ms)
 */
function SearchBar({ onSearch, placeholder = "검색어 입력", delay = 500 }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [timerId, setTimerId] = useState(null);

    const handleChange = (e) => {
        const { value } = e.target;

        setSearchTerm(value);

        // 기존 타이머가 있으면 클리어
        if (timerId) {
            clearTimeout(timerId);
        }

        // 일정 시간 기다린 뒤에 onSearch 호출 (디바운싱)
        const newTimer = setTimeout(() => {
            if (value.trim()) {
                onSearch(value.trim());
            } else {
                onSearch("");
            }
        }, delay);

        setTimerId(newTimer);
    };

    // 컴포넌트 언마운트 시 타이머 정리
    useEffect(
        () => () => {
            if (timerId) {
                clearTimeout(timerId);
            }
        },
        [timerId]
    );

    // IconButton 클릭 시 즉시 검색
    const handleImmediateSearch = () => {
        if (timerId) {
            clearTimeout(timerId);
        }
        onSearch(searchTerm.trim());
    };

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                p: 2,
                bgcolor: "#FFFFFF",
                mt: 2,
                mb: 2
            }}
        >
            <IconButton onClick={handleImmediateSearch}>
                <SearchIcon />
            </IconButton>
            <InputBase
                placeholder={placeholder}
                sx={{ ml: 1, flex: 1 }}
                value={searchTerm}
                onChange={handleChange}
            />
        </Box>
    );
}

export default SearchBar;
