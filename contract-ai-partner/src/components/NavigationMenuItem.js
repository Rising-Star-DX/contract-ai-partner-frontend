import React from "react";
import { Box, Typography, useTheme, Collapse } from "@mui/material";

// subMenu = []: 하위 메뉴 배열을 받을 수 있도록 기본값 처리
function NavigationMenuItem({
    icon,
    label,
    onMainClick, // 상위 메뉴 클릭 시 실행될 함수
    isOpen = false, // 해당 메뉴가 열려있는지 여부 (부모에서 결정)
    subMenu = [],
    onSubMenuClick, // 서브 메뉴 클릭 시 실행될 함수(옵션)
    activeKey, // 현재 선택된 메뉴 key
    menuKey, // 상위 메뉴 구분용 key
    isActiveMain, // 상위 메뉴 활성화 여부
}) {
    const theme = useTheme();

    // 아이콘 색상 처리
    let iconElement = icon;

    if (React.isValidElement(icon)) {
        const isActive = activeKey === menuKey;

        iconElement = React.cloneElement(icon, {
            style: {
                color:
                    isActive || isActiveMain
                        ? theme.palette.primary.main
                        : "#ABB2B9",
            },
        });
    }

    // 상위 메뉴 클릭 시
    const handleMainClick = () => {
        if (onMainClick) {
            onMainClick(menuKey, subMenu.length > 0);
            // subMenu가 있는 메뉴인 경우에만 펼침/접힘 처리
        }
    };

    // 서브 메뉴 렌더링
    const renderSubMenu = () => {
        if (subMenu.length === 0) return null;
        return (
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <Box sx={{ pl: 12 }}>
                    {subMenu.map((item) => (
                        <Box
                            key={item.key}
                            onClick={() => {
                                if (onSubMenuClick) onSubMenuClick(item.key);
                            }}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                height: 40,
                                cursor: "pointer",
                                userSelect: "none",
                                "&:hover": { backgroundColor: "#F0F4FA" },
                            }}
                        >
                            {/* 서브메뉴 라벨 */}
                            <Typography
                                sx={{
                                    color:
                                        activeKey === item.key
                                            ? theme.palette.primary.main
                                            : "#666",
                                    fontSize: 14,
                                    fontWeight: 600,
                                }}
                            >
                                {item.label}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Collapse>
        );
    };

    return (
        <Box>
            {/* 상위 메뉴 박스 */}
            <Box
                onClick={handleMainClick}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    height: 56,
                    px: 4,
                    cursor: "pointer",
                    userSelect: "none",
                    "&:hover": {
                        backgroundColor: "#E0E8F6",
                    },
                    bgcolor: isActiveMain ? "#E0E8F6" : "#FFFFFF",
                }}
            >
                {/* 상단 아이콘 */}
                <Box sx={{ mr: 2 }}>{iconElement}</Box>

                {/* 메뉴 라벨 */}
                <Typography
                    sx={{
                        color: isActiveMain
                            ? theme.palette.primary.main
                            : "#ABB2B9",
                        fontWeight: 900,
                        fontSize: 16,
                    }}
                >
                    {label}
                </Typography>
            </Box>

            {/* 서브 메뉴 렌더링 */}
            {renderSubMenu()}
        </Box>
    );
}

export default NavigationMenuItem;
