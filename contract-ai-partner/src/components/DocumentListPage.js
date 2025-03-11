// src/components/DocumentListPage.js
import React from "react";
import {Box, Typography, Button, Tabs, Tab, IconButton, InputBase} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";

import MainLayout from "../layouts/MainLayout";

// 파일 아이콘들 (DocIcon, PdfIcon, etc)
import getDocIcon from "../utils/docIcons";

// DocumentListPage 재사용 컴포넌트
function DocumentListPage({
	title, // 페이지 상단 제목: ex) "계약 문서 일람", "기준 문서 일람"
	rows, // DataGrid에 넣을 row 데이터
	columns, // DataGrid 컬럼 정의
	tabs = [], // 탭 라벨 배열
	showNewButton, // role이 admin이면 true
	onNewDocClick, // + 새 문서 버튼 클릭 핸들러
	onRowView, // 문서 보기 클릭 핸들러
	onRowDelete, // 문서 삭제 클릭 핸들러
}) {
	// 탭 상태
	const [tabValue, setTabValue] = React.useState(0);
	const handleTabChange = (e, newValue) => setTabValue(newValue);

	// 검색어 상태 (필요하면 활용)
	const [searchTerm, setSearchTerm] = React.useState("");

	// DataGrid 컬럼에 렌더링 로직을 주입할 수도 있음(문서 보기, 삭제 아이콘 등)
	const mergedColumns = columns.map(col => {
		// 문서 이름 칼럼
		if (col.field === "name") {
			return {
				...col,
				renderCell: params => {
					const iconUrl = getDocIcon(params.row.iconType);

					return (
						<Box sx={{display: "flex", alignItems: "center"}}>
							<img src={iconUrl} alt="문서 아이콘" width={32} height={32} />
							<Box sx={{ml: 4}}>{params.value}</Box>
						</Box>
					);
				},
			};
		}

		// 예: col.field === 'view' 에서 문서 보기 버튼
		if (col.field === "view") {
			return {
				...col,
				renderCell: params => (
					<Button variant="outlined" size="middle" onClick={() => onRowView?.(params.row)}>
						문서 보기
					</Button>
				),
			};
		}
		// 예: col.field === 'delete' 에서 삭제 아이콘
		if (col.field === "delete") {
			return {
				...col,
				renderCell: params => (
					<IconButton color="error" onClick={() => onRowDelete?.(params.row.id)}>
						<RemoveCircleOutlineOutlinedIcon />
					</IconButton>
				),
			};
		}
		return col;
	});

	return (
		<MainLayout>
			{/* 전체 화면(사이드바 영역) 내 스크롤은 없애고, 내부에서만 스크롤 */}
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					height: "100%",
					overflow: "hidden", // 여기서도 스크롤 감춤
				}}
			>
				{/* 상단: 제목 + 새 문서 버튼 */}
				<Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", pb: 2}}>
					<Typography variant="h4" fontWeight="bold">
						{title}
					</Typography>
					{showNewButton && (
						<Button variant="contained" color="primary" size="large" onClick={onNewDocClick}>
							+ 새 문서
						</Button>
					)}
				</Box>

				{/* 탭 영역 */}
				{tabs.length > 0 && (
					<Box sx={{borderBottom: 2, borderColor: "divider", mb: 2}}>
						<Tabs value={tabValue} onChange={handleTabChange}>
							{tabs.map((tabLabel, idx) => (
								<Tab key={tabLabel} label={tabLabel} value={idx} />
							))}
						</Tabs>
					</Box>
				)}

				{/* 검색 */}
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						p: 2,
						bgcolor: "#FFFFFF",
						mb: 2,
						flexShrink: 0, // 높이 고정
					}}
				>
					<IconButton>
						<SearchIcon />
					</IconButton>
					<InputBase
						placeholder="검색어 입력"
						sx={{ml: 1, flex: 1}}
						value={searchTerm}
						onChange={e => setSearchTerm(e.target.value)}
					/>
				</Box>

				{/* Datagrid 영역: 남은 공간 전부 차지 & 내부 스크롤 */}
				<Box sx={{flexGrow: 1, overflow: "auto", bgcolor: "#FFFFFF"}}>
					<DataGrid
						rows={rows}
						columns={mergedColumns}
						pageSize={5}
						rowsPerPageOptions={[5, 10, 20]}
						checkboxSelection
						disableSelectionOnClick
						disableColumnMenu
						rowHeight={56}
						headerHeight={60}
						sx={{
							minHeight: "100%", // 공간을 꽉 채우도록
							"& .MuiDataGrid-columnHeader": {
								backgroundColor: "#E5E7E9",
							},
							"& .MuiDataGrid-columnHeaderTitle": {
								fontSize: "20px",
								fontWeight: 900,
							},
							"& .MuiDataGrid-cell": {
								backgroundColor: "#FFFFFF",
								fontSize: "16px",
								fontWeight: 400,
							},
						}}
					/>
				</Box>
			</Box>
		</MainLayout>
	);
}

export default DocumentListPage;
