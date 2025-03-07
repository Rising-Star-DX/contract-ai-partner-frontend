import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import BalanceOutlinedIcon from "@mui/icons-material/BalanceOutlined";
import {Box} from "@mui/material";

import {React, useState} from "react";

import NavigationMenuItem from "./NavigationMenuItem";
import UserProfile from "./UserProfile";
import avatarSample from "../assets/images/avatar_sample.png";

function Sidebar() {
	// 현재 활성화된 메뉴를 저장하는 상태
	const [selectedMenu, setSelectedMenu] = useState("contract");

	// 메뉴 클릭 시 상태 업데이트
	const handleMenuClick = menuKey => {
		setSelectedMenu(menuKey);
		console.log(`${menuKey} 메뉴 클릭됨`);
	};

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
				<NavigationMenuItem
					icon={<AssignmentOutlinedIcon />}
					label="계약 문서"
					active={selectedMenu === "contract"} // 활성화
					onClick={() => handleMenuClick("contract")}
				/>

				<NavigationMenuItem
					icon={<InsightsOutlinedIcon />}
					label="AI 분석 보고서"
					active={selectedMenu === "ai"}
					onClick={() => handleMenuClick("ai")}
				/>

				<NavigationMenuItem
					icon={<BalanceOutlinedIcon />}
					label="기준 문서"
					active={selectedMenu === "criteria"}
					onClick={() => handleMenuClick("criteria")}
				/>
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
