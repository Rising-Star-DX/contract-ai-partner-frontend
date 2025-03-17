// constants/docColumns.js
import React from "react";
import {Box, Button, IconButton, Chip} from "@mui/material";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import {getDocIcon} from "../utils/docUtils";

// 상태에 따른 Chip 색상을 반환하는 별도 함수
const getChipColor = status => {
	if (status.includes("완료")) return "success";
	if (status.includes("실패")) return "error";
	if (status.includes("중")) return "info";
	return "default";
};

const DOC_COLUMNS = (onRowView, onRowDelete) => [
	{
		field: "name",
		headerName: "문서명",
		flex: 2,
		renderCell: params => (
			<Box sx={{display: "flex", alignItems: "center"}}>
				<img src={getDocIcon(params.row.iconType)} alt="문서 아이콘" width={32} height={32} />
				<Box sx={{ml: 4}}>{params.value}</Box>
			</Box>
		),
	}, {
		field: "category",
		headerName: "카테고리",
		flex: 1,
		headerAlign: "center",
		align: "center",
	}, {
		field: "uploadDate",
		headerName: "업로드 일자",
		flex: 1.5,
		type: "dateTime",
		headerAlign: "center",
		align: "center",
		valueGetter: params => new Date(params),
	}, {
		field: "status",
		headerName: "문서 상태",
		flex: 0.7,
		type: "singleSelect",
		valueOptions: ["업로드 중", "업로드 실패", "AI 분석 중", "AI 분석 완료", "AI 분석 실패"],
		headerAlign: "center",
		align: "center",
		renderCell: params => <Chip label={params.value} color={getChipColor(params.value)} />,
	}, {
		field: "view",
		headerName: "",
		minWidth: 160,
		sortable: false,
		headerAlign: "center",
		align: "center",
		renderCell: params => (
			<Button variant="outlined" size="middle" onClick={() => onRowView?.(params.row)}>
				문서 보기
			</Button>
		),
	}, {
		field: "delete",
		headerName: "",
		flex: 0.5,
		sortable: false,
		headerAlign: "center",
		align: "center",
		renderCell: params => (
			<IconButton color="error" onClick={() => onRowDelete?.(params.row.id)}>
				<RemoveCircleOutlineOutlinedIcon />
			</IconButton>
		),
	},
];

export default DOC_COLUMNS;
