// src/pages/ContractList.js
import React, {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import {randomCreatedDate} from "@mui/x-data-grid-generator";

import RoleContext from "../contexts/RoleContext";

import DocumentListPage from "../components/DocumentListPage";
import FileUploadModal from "../components/FileUploadModal";

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

	// 모달 창 상태
	const [modalOpen, setModalOpen] = useState(false);

	// 새 문서 추가 버튼
	const handleNewDocClick = () => {
		setModalOpen(true);
	};

	const handleUpload = file => {
		console.log("업로드된 파일:", file);
		setModalOpen(false);
	};

	// 삭제 핸들러
	const handleDelete = id => {
		alert(`계약 문서 ID ${id} 삭제 (예시)`);
	};

	return (
		<>
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

			{/* 파일 업로드 모달 */}
			<FileUploadModal open={modalOpen} onClose={() => setModalOpen(false)} onUpload={handleUpload} />
		</>
	);
}

export default ContractList;
