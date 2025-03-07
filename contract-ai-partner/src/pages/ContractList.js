import React from "react";
import {useNavigate} from "react-router-dom";
import {Box, Typography, Button, Tabs, Tab, IconButton, InputBase} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import DeleteIcon from "@mui/icons-material/Delete";
import {randomCreatedDate} from "@mui/x-data-grid-generator";

import MainLayout from "../layouts/MainLayout";

// 파일 아이콘
import DocIcon from "../assets/images/ic_doc.png";
import JpgIcon from "../assets/images/ic_jpg.png";
import PdfIcon from "../assets/images/ic_pdf.png";
import PngIcon from "../assets/images/ic_png.png";
import TxtIcon from "../assets/images/ic_txt.png";
import XlsIcon from "../assets/images/ic_xls.png";

// 문서 유형에 따른 아이콘 매핑
function getDocIcon(iconType) {
	switch (iconType) {
		case "DOC":
			return DocIcon;
		case "JPG":
			return JpgIcon;
		case "PDF":
			return PdfIcon;
		case "PNG":
			return PngIcon;
		case "TXT":
			return TxtIcon;
		case "XLS":
			return XlsIcon;

		default:
			return DocIcon;
	}
}

function ContractList() {
	// 더미 데이터
	const DUMMY_DATA = [
		{
			id: 1,
			iconType: "PDF",
			name: "문서이름 문서이름 문서이름 1",
			category: "R&D 계약",
			uploadDate: randomCreatedDate(),
			status: "업로드 완료",
		}, {
			id: 2,
			iconType: "DOC",
			name: "문서이름 문서이름 문서이름 2",
			category: "구매 계약",
			uploadDate: randomCreatedDate(),
			status: "업로드 중",
		}, {
			id: 3,
			iconType: "XLS",
			name: "문서이름 문서이름 문서이름 3",
			category: "공사 계약",
			uploadDate: randomCreatedDate(),
			status: "업로드 실패",
		},
	];

	// 문서 보기 클릭
	const navigate = useNavigate();

	const handleViewDocument = row => {
		navigate("/contract-review", {
			state: {
				category: row.category,
				docName: row.name,
				docType: row.iconType.toUpperCase(),
			},
		});
	};

	// 삭제 아이콘 클릭 (예시)
	const handleDelete = id => {
		alert(`ID ${id} 문서를 삭제합니다(예시)`);
		// 실제로는 API 호출 후 상태 갱신
	};

	// 탭 상태
	const [tabValue, setTabValue] = React.useState(0);
	const handleTabChange = (event, newValue) => {
		setTabValue(newValue);
	};

	// DataGrid 컬럼 정의
	const columns = [
		{
			// (1) 문서 이름 (아이콘 + 이름)

			field: "name",
			headerName: "문서 이름",
			flex: 1,
			headerAlign: "left",
			renderCell: params => {
				const docIcon = getDocIcon(params.row.iconType);

				return (
					<Box sx={{display: "flex", alignItems: "center"}}>
						<img src={docIcon} alt="문서 아이콘" height="32px" width="32px" />
						<Box sx={{ml: 4}}>{params.value}</Box>
					</Box>
				);
			},
		}, {
			// (2) 카테고리 컬럼

			field: "category",
			headerName: "카테고리",
			width: 160,
			headerAlign: "center",
			align: "center",
		}, {
			// (3) 업로드 일자

			field: "uploadDate",
			headerName: "업로드 일자",
			type: "dateTime",
			width: 300,
			headerAlign: "center",
			align: "center",
		}, {
			// (4) 업로드 상태

			field: "status",
			headerName: "업로드 상태",
			type: "singleSelect",
			valueOptions: ["업로드 완료", "업로드 중", "업로드 실패"],
			width: 160,
			headerAlign: "center",
			align: "center",
		}, {
			// (5) 문서 보기 버튼

			field: "view",
			headerName: "",
			width: 140,
			sortable: false,
			headerAlign: "center",
			align: "center",
			renderCell: params => (
				<Button variant="outlined" size="medium" onClick={() => handleViewDocument(params.row)}>
					문서 보기
				</Button>
			),
		}, {
			// (7) 삭제 아이콘

			field: "delete",
			headerName: "",
			width: 50,
			sortable: false,
			headerAlign: "center",
			align: "center",
			renderCell: params => (
				<IconButton color="error" onClick={() => handleDelete(params.row.id)}>
					<DeleteIcon />
				</IconButton>
			),
		},
	];

	return (
		<MainLayout>
			{/* 상단 영역 */}
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					pb: 8,
				}}
			>
				<Typography variant="h4" fontWeight="bold">
					계약 문서 일람
				</Typography>
				<Button variant="contained" color="primary" size="large">
					+ 새 문서
				</Button>
			</Box>

			{/* 탭 영역 */}
			<Box sx={{borderBottom: 2, borderColor: "divider", mb: 4}}>
				<Tabs value={tabValue} onChange={handleTabChange}>
					<Tab label="전체" sx={{pb: 4}} />
					<Tab label="R&D 계약" />
					<Tab label="구매 계약" />
					<Tab label="공사 계약" />
					<Tab label="법령" />
				</Tabs>
			</Box>

			{/* 검색 & 필터 아이콘 */}
			<Box sx={{display: "flex", alignItems: "center", p: 2, bgcolor: "#FFFFFF", mb: 4}}>
				<IconButton>
					<SearchIcon />
				</IconButton>
				<InputBase placeholder="검색어 입력" sx={{ml: 1, flex: 1}} />
				<IconButton>
					<FilterListIcon />
				</IconButton>
			</Box>

			{/* DataGrid 테이블 */}
			<Box
				sx={{
					display: "flex",
					height: "100%",
					bgcolor: "#FFFFFF",
					flexDirection: columns,
					maxHeight: 600,
				}}
			>
				<DataGrid
					rows={DUMMY_DATA}
					columns={columns}
					pageSize={5}
					rowsPerPageOptions={[5, 10, 20]}
					// 체크박스 헤더 + 전체 선택
					checkboxSelection
					// 클릭으로 행 선택 방지(버튼 동작 우선)
					disableSelectionOnClick
					// 테이블 헤더 메뉴 삭제
					disableColumnMenu
					// 행 높이와 헤더 높이
					rowHeight={56}
					headerHeight={60}
					// 커스텀 스타일
					sx={{
						// 헤더 배경색
						"& .MuiDataGrid-columnHeader": {
							backgroundColor: "#E5E7E9",
						},
						// 헤더 폰트 스타일
						"& .MuiDataGrid-columnHeaderTitle": {
							fontSize: "20px",
							fontWeight: 900,
						},
						// 테이블 열 스타일
						"& .MuiDataGrid-cell": {
							backgroundColor: "#FFFFFF",
							fontSize: "16px",
							fontWeight: 400,
						},
					}}
				/>
			</Box>
		</MainLayout>
	);
}

export default ContractList;
