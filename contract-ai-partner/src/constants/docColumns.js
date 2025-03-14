const DOC_COLUMNS = [
	{
		field: "name",
		headerName: "문서 이름",
		flex: 1,
		renderCell: params => params.value,
	}, {
		field: "category",
		headerName: "카테고리",
		width: 160,
		headerAlign: "center",
		align: "center",
	}, {
		field: "uploadDate",
		headerName: "업로드 일자",
		type: "dateTime",
		width: 250,
		headerAlign: "center",
		align: "center",
	}, {
		field: "status",
		headerName: "문서 상태",
		type: "singleSelect",
		valueOptions: ["업로드 중", "업로드 실패", "AI 분석 중", "AI 분석 완료", "AI 분석 실패"],
		width: 160,
		headerAlign: "center",
		align: "center",
	}, {
		field: "view",
		headerName: "",
		width: 160,
		sortable: false,
		headerAlign: "center",
		align: "center",
	}, {
		field: "delete",
		headerName: "",
		width: 60,
		sortable: false,
		headerAlign: "center",
		align: "center",
	},
];

export default DOC_COLUMNS;
