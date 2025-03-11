import React, {useState, useContext} from "react";
import {Box} from "@mui/material";

// 아이콘 import
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import BalanceOutlinedIcon from "@mui/icons-material/BalanceOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";

// 컴포넌트
import NavigationMenuItem from "./NavigationMenuItem";
import UserProfile from "./UserProfile";

// 임시 프로필 이미지
import avatarSample from "../assets/images/avatar_sample.png";

// context
import RoleContext from "../contexts/RoleContext";

function Sidebar() {
	// 열려있는 상위 메뉴 key (한 번에 하나만 열리게)
	const [openedMenu, setOpenedMenu] = useState(null);
	// 선택된 메뉴 key (하위 메뉴까지 포함)
	const [selectedMenuKey, setSelectedMenuKey] = useState(null);

	// 상위 메뉴 클릭 시
	const handleMainMenuClick = (menuKey, hasSubMenu) => {
		// hasSubMenu가 없으면 그냥 선택만
		if (!hasSubMenu) {
			setSelectedMenuKey(menuKey);
			// 다른 메뉴 열려있으면 닫기
			setOpenedMenu(null);
			return;
		}

		// hasSubMenu가 있는 메뉴면, 클릭 시 토글
		if (openedMenu === menuKey) {
			// 이미 열려있다면 닫기
			setOpenedMenu(null);
		} else {
			// 다른 메뉴가 열려있다면 먼저 닫고, 새 메뉴 열기
			setOpenedMenu(menuKey);
		}
		// 상위 메뉴 자체를 선택한 것으로 처리
		setSelectedMenuKey(menuKey);
	};

	const handleSubMenuClick = subKey => {
		setSelectedMenuKey(subKey);
	};

	// 권한
	const role = useContext(RoleContext);

	// 권한별 메뉴 구성
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
				}, {
					key: "categoryMgmt",
					label: "카테고리 관리",
				},
			],
		}, {
			key: "contractDocs",
			label: "계약 문서",
			icon: <AssignmentOutlinedIcon />,
		}, {
			key: "userHistory",
			label: "사용자 이력",
			icon: <AccountCircleOutlinedIcon />,
		},
	];

	const userMenus = [
		{
			key: "contract",
			icon: <AssignmentOutlinedIcon />,
			label: "계약 문서",
		}, {
			key: "ai",
			icon: <InsightsOutlinedIcon />,
			label: "AI 분석 보고서",
		}, {
			key: "criteria",
			icon: <BalanceOutlinedIcon />,
			label: "기준 문서",
		},
	];

	// role이 admin이면 adminMenus, 아니면 userMenus
	const menusToRender = role === "admin" ? adminMenus : userMenus;

	return (
		<Box
			sx={{
				width: 300,
				borderRight: "1px solid #ddd",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				bgcolor: "#ffffff",
			}}
		>
			{/* 네비게이션 메뉴 */}
			<Box>
				{menusToRender.map(menu => {
					const hasSubMenu = menu.subMenu && menu.subMenu.length > 0;
					// isOpen: 현재 열려있는 상위 메뉴 key와 일치하면 true
					const isOpen = openedMenu === menu.key;

					// 하위 메뉴들의 key 목록
					const subMenuKeys = hasSubMenu ? menu.subMenu.map(item => item.key) : [];

					// [상위 메뉴 활성화 조건]
					// 1) selectedMenuKey === menu.key
					// 2) selectedMenuKey가 subMenuKeys에 포함되어 있으면 상위 메뉴도 활성
					const isActiveMain = selectedMenuKey === menu.key || subMenuKeys.includes(selectedMenuKey);

					return (
						<NavigationMenuItem
							key={menu.key}
							menuKey={menu.key}
							label={menu.label}
							icon={menu.icon}
							subMenu={menu.subMenu || []}
							isOpen={isOpen}
							isActiveMain={isActiveMain}
							activeKey={selectedMenuKey} // 현재 선택된 상위/하위 메뉴 key
							onMainClick={(key, hasSub) => handleMainMenuClick(key, hasSubMenu)}
							onSubMenuClick={subKey => handleSubMenuClick(subKey)}
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
