import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box } from "@mui/material";

// 아이콘 import
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import BalanceOutlinedIcon from "@mui/icons-material/BalanceOutlined";

// 컴포넌트
import NavigationMenuItem from "./NavigationMenuItem";
import UserProfile from "./UserProfile";

// 임시 프로필 이미지
import avatarSample from "../assets/images/avatar_sample.png";

// context
import RoleContext from "../contexts/RoleContext";

/**
 * MSA 기반 AI 계약서 검토 시스템 - Sidebar 컴포넌트
 * - 관리자 / 사용자 권한(role)에 따라 메뉴가 달라짐
 * - 메인/서브 메뉴 클릭 시, 경로 이동 (react-router-dom)
 * - 서브 메뉴 펼침/접힘(toggle) 가능
 * - no-unused-vars 규칙을 지켜 불필요한 변수를 모두 제거
 */

function Sidebar() {
    // 열려있는 상위 메뉴 key (한 번에 하나만 열리도록)
    const [openedMenu, setOpenedMenu] = useState(null);

    // 리액트 라우터
    const navigate = useNavigate();
    const { pathname } = useLocation();

    // 권한
    const role = useContext(RoleContext);

    /**
     * 상위 메뉴 클릭 시 실행
     * @param {string} menuKey - 상위 메뉴를 식별하기 위한 key
     * @param {boolean} hasSubMenu - 하위 메뉴 존재 여부
     * @param {string} path - 이동할 경로 (있을 경우)
     */
    const handleMainMenuClick = (menuKey, hasSubMenu, path) => {
        setOpenedMenu(menuKey);
        // 서브 메뉴가 없다면 바로 경로 이동
        if (hasSubMenu) {
            // 서브 메뉴 토글
            if (openedMenu !== menuKey) {
                setOpenedMenu(menuKey);
            }
        } else if (path) {
            navigate(path);
        }
    };

    /**
     * 하위 메뉴 클릭 시 실행
     * @param {string} subKey - 하위 메뉴를 식별하기 위한 key
     * @param {string} path - 이동할 경로 (있을 경우)
     */
    const handleSubMenuClick = (subKey, subPath) => {
        navigate(subPath);
    };

    // 관리자 메뉴
    const adminMenus = [
        {
            key: "criteria",
            label: "기준 문서",
            icon: <BalanceOutlinedIcon />,
            subMenu: [
                {
                    key: "standardDocs",
                    label: "기준 문서 일람",
                    path: "/standards"
                },
                {
                    key: "categoryMgmt",
                    label: "카테고리 관리",
                    path: "/categories"
                }
            ]
        },
        {
            key: "contractDocs",
            label: "계약 문서",
            icon: <AssignmentOutlinedIcon />,
            path: "/agreements"
        }
    ];

    // 사용자 메뉴
    const userMenus = [
        {
            key: "contract",
            icon: <AssignmentOutlinedIcon />,
            label: "계약 문서",
            path: "/agreements"
        },
        {
            key: "ai",
            icon: <InsightsOutlinedIcon />,
            label: "AI 분석 보고서"
            // path 미지정 시 navigate 생략 가능 (또는 추후 설정)
        },
        {
            key: "criteria",
            icon: <BalanceOutlinedIcon />,
            label: "기준 문서",
            path: "/standards"
        }
    ];

    // 권한별로 메뉴 분기
    const menusToRender = role === "admin" ? adminMenus : userMenus;

    return (
        <Box
            sx={{
                width: 300,
                borderRight: "1px solid #ddd",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                bgcolor: "#ffffff"
            }}
        >
            {/* 네비게이션 메뉴 */}
            <Box>
                {menusToRender.map((menu) => {
                    // 하위 메뉴 존재 여부
                    const hasSubMenu =
                        Array.isArray(menu.subMenu) && menu.subMenu.length > 0;

                    // 현재 열린 상위 메뉴인지 확인
                    const isOpen = openedMenu === menu.key;

                    // (서브 메뉴 path도 고려하여) 현재 경로와 비교해 상위 메뉴 활성화 판별
                    const subPaths = hasSubMenu
                        ? menu.subMenu.map((sub) => sub.path)
                        : [];
                    const isActiveMain =
                        (menu.path && pathname.startsWith(menu.path)) ||
                        subPaths.some((p) => p && pathname.startsWith(p));

                    return (
                        <NavigationMenuItem
                            key={menu.key}
                            menuKey={menu.key}
                            label={menu.label}
                            icon={menu.icon}
                            subMenu={menu.subMenu || []}
                            isOpen={isOpen}
                            isActiveMain={isActiveMain}
                            // 현재 경로를 activeKey로 넘김
                            activeKey={pathname}
                            // 상위 메뉴 클릭
                            onMainClick={(clickedKey, isSub) => {
                                handleMainMenuClick(
                                    clickedKey,
                                    isSub,
                                    menu.path
                                );
                            }}
                            // 하위 메뉴 클릭
                            onSubMenuClick={(subKey) => {
                                const sub = menu.subMenu?.find(
                                    (item) => item.key === subKey
                                );

                                if (sub) {
                                    handleSubMenuClick(sub.key, sub.path);
                                }
                            }}
                        />
                    );
                })}
            </Box>

            {/* 하단 사용자 정보 */}
            <Box>
                <UserProfile
                    avatarUrl={avatarSample}
                    userName="POSCO DX"
                    userTeam="R&D 1팀"
                    userEmail="sample123@poscodx.com"
                />
            </Box>
        </Box>
    );
}

export default Sidebar;
