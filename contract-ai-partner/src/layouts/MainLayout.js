import React from "react";
import {Box} from "@mui/material";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function MainLayout({children}) {
	return (
		// 전체를 수직으로 배치: [헤더] + [본문(사이드바+컨텐츠)]
		<Box sx={{display: "flex", flexDirection: "column", height: "100vh"}}>
			{/* 상단 헤더 */}
			<Header />

			{/* 하단 사이드바 + 메인 컨텐츠 영역 */}
			<Box sx={{display: "flex", flexGrow: 1, overflow: "hidden"}}>
				{/* 왼쪽 사이드바 */}
				<Sidebar />

				{/* 오른쪽 메인 컨텐츠 */}
				<Box sx={{flexGrow: 1, overflow: "hidden", bgcolor: "#F8F9F9", p: 8}}>{children}</Box>
			</Box>
		</Box>
	);
}

export default MainLayout;
