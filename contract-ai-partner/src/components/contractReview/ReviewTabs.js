// src/components/ReviewTab.jsx
import React, { useState } from "react";
import { Typography, Menu, MenuItem, Grid2 } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

function ReviewTab() {
    // 왼쪽 메뉴(“원본” / “수동 문구”) 상태
    const [selectedLeft, setSelectedLeft] = useState("원본");
    const [anchorElLeft, setAnchorElLeft] = useState(null);

    // 왼쪽 메뉴 열기/닫기
    const handleOpenLeftMenu = (event) => setAnchorElLeft(event.currentTarget);
    const handleCloseLeftMenu = () => setAnchorElLeft(null);

    // 왼쪽 메뉴 항목 선택
    const handleSelectLeftMenu = (value) => {
        setSelectedLeft(value);
        handleCloseLeftMenu();
    };

    return (
        <Grid2
            container
            sx={{
                width: "100%",
                height: 48,
                backgroundColor: "#FFFFFF",
            }}
        >
            {/* (1) 왼쪽 영역: "원본" / "수동 문구" */}
            <Grid2
                size={5}
                container
                justifyContent="center"
                alignItems="center"
                onClick={handleOpenLeftMenu}
                sx={{
                    cursor: "pointer",
                    textAlign: "center",
                }}
            >
                <Typography
                    variant="h7"
                    sx={{
                        fontWeight: "bold",
                        color: "#333",
                    }}
                >
                    {selectedLeft}
                </Typography>
                <ArrowDropDownIcon sx={{ ml: 1 }} />
            </Grid2>

            {/* (2) 가운데 화살표 아이콘 */}
            <Grid2
                size={2}
                container
                justifyContent="center"
                alignItems="center"
                sx={{ textAlign: "center" }}
            >
                <ArrowForwardIcon sx={{ color: "#000" }} />
            </Grid2>

            {/* (3) 오른쪽 영역: "검토 결과" */}
            <Grid2
                size={5}
                container
                justifyContent="center"
                alignItems="center"
                sx={{ textAlign: "center" }}
            >
                <Typography
                    variant="h7"
                    sx={{
                        fontWeight: "bold",
                        color: "#1A73E8",
                    }}
                >
                    검토 결과
                </Typography>
            </Grid2>

            {/* 드롭다운 메뉴 (왼쪽) */}
            <Menu
                anchorEl={anchorElLeft}
                open={Boolean(anchorElLeft)}
                onClose={handleCloseLeftMenu}
            >
                <MenuItem
                    selected={selectedLeft === "원본"}
                    onClick={() => handleSelectLeftMenu("원본")}
                >
                    원본
                </MenuItem>
                <MenuItem
                    selected={selectedLeft === "수동 문구"}
                    onClick={() => handleSelectLeftMenu("수동 문구")}
                >
                    수동 문구
                </MenuItem>
            </Menu>
        </Grid2>
    );
}

export default ReviewTab;
