import React, {useContext} from "react";
import {randomCreatedDate} from "@mui/x-data-grid-generator";
import {useNavigate} from "react-router-dom";

import RoleContext from "../contexts/RoleContext";

import DocumentListPage from "../components/DocumentListPage";
import DOC_COLUMNS from "../constants/docColumns";

function StandardList() {
	const role = useContext(RoleContext);
	const navigate = useNavigate();

	const DUMMY_DATA = [
		{
			id: 101,
			iconType: "PDF",
			name: "기준문서 101",
			category: "R&D 계약",
			uploadDate: randomCreatedDate(),
			status: "업로드 완료",
		}, {
			id: 102,
			iconType: "DOC",
			name: "기준문서 102",
			category: "구매 계약",
			uploadDate: randomCreatedDate(),
			status: "업로드 중",
		}, {
			id: 103,
			iconType: "TXT",
			name: "기준문서 103",
			category: "공사 계약",
			uploadDate: randomCreatedDate(),
			status: "업로드 실패",
		},
	];

	// 문서 보기 클릭
	const handleViewDoc = row => {
		navigate(`/standards/${row.id}`, {
			state: {
				docName: row.name,
				category: row.category,
				docType: row.iconType,
			},
		});
	};

	// 새 문서 버튼
	const handleNewStandardDoc = () => {
		alert("새 기준 문서 등록 (Standard)");
	};

	// 삭제
	const handleDelete = id => {
		alert(`기준문서 ID ${id} 삭제 (예시)`);
	};

	return (
		<DocumentListPage
			title="기준 문서 일람"
			rows={DUMMY_DATA}
			columns={DOC_COLUMNS}
			tabs={["전체", "R&D 계약", "구매 계약", "공사 계약", "법령"]}
			showNewButton={role === "admin"} // admin일 때만 새문서
			onNewDocClick={handleNewStandardDoc}
			onRowView={handleViewDoc}
			onRowDelete={handleDelete}
		/>
	);
}

export default StandardList;
