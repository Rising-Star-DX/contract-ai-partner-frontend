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
		headerName: "업로드 상태",
		type: "singleSelect",
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
