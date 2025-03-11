// src/pages/ContractList.js
import React, {useContext} from "react";
import {useNavigate} from "react-router-dom";
import {randomCreatedDate} from "@mui/x-data-grid-generator";

import RoleContext from "../contexts/RoleContext";

import DocumentListPage from "../components/DocumentListPage";

import DOC_COLUMNS from "../constants/docColumns";

function ContractList() {
	// role 가져오기
	const role = useContext(RoleContext);

	const navigate = useNavigate();

	// 문서 더미데이터
	const DUMMY_DATA = [
		{
			id: 1,
			iconType: "PDF",
			name: "문서이름 1",
			category: "R&D 계약",
			uploadDate: randomCreatedDate(),
			status: "업로드 완료",
		}, {
			id: 2,
			iconType: "DOC",
			name: "문서이름 2",
			category: "구매 계약",
			uploadDate: randomCreatedDate(),
			status: "업로드 중",
		},
	];

	// 문서 보기 핸들러
	const handleViewDocument = row => {
		navigate(`/agreement/${row.id}`, {
			state: {
				category: row.category,
				docName: row.name,
				docType: row.iconType,
			},
		});
	};

	// 새 문서 추가 버튼
	const handleNewDocClick = () => {
		alert("새 문서 등록 (Contract)");
	};

	// 삭제 핸들러
	const handleDelete = id => {
		alert(`계약 문서 ID ${id} 삭제 (예시)`);
	};

	return (
		<DocumentListPage
			title="계약 문서 일람"
			rows={DUMMY_DATA}
			columns={DOC_COLUMNS}
			tabs={["전체", "R&D 계약", "구매 계약", "공사 계약", "법령"]}
			showNewButton={role === "admin"} // admin만 +새문서 가능
			onNewDocClick={handleNewDocClick}
			onRowView={handleViewDocument}
			onRowDelete={handleDelete}
		/>
	);
}

export default ContractList;
