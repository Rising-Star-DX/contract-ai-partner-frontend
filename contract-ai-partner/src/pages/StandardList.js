// src/pages/StandardList.js
import React, {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";

import RoleContext from "../contexts/RoleContext";
import DocumentListPage from "../components/DocumentListPage";
import DOC_COLUMNS from "../constants/docColumns";
import {useCategory} from "../contexts/CategoryContext";
import useDocumentList from "../hooks/useDocumentList";
import {fetchAllStandardDocs, fetchStandardsByCategory} from "../api/standardsApi";
import {mapStandardDocsForGrid} from "../utils/docUtils";

import FileUploadModal from "../components/FileUploadModal";

function StandardList() {
	const role = useContext(RoleContext);
	const navigate = useNavigate();

	// 모달 창 상태
	const [modalOpen, setModalOpen] = useState(false);

	const {categories} = useCategory();

	// 탭 상태 관리
	const [tabValue, setTabValue] = useState(0);
	const selectedCategoryId = categories[tabValue]?.id || null;

	// 문서 리스트 가져오는 커스텀 훅
	const {documents, loading, error} = useDocumentList(
		selectedCategoryId,
		fetchStandardsByCategory,
		fetchAllStandardDocs,
		mapStandardDocsForGrid,
	);

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

	// 새 문서 버튼 클릭
	const handleNewStandardDoc = () => {
		setModalOpen(true);
	};

	// 문서 삭제 버튼 클릭
	const handleDelete = id => {
		alert(`기준문서 ID ${id} 삭제 (예시)`);
	};

	const handleUpload = file => {
		console.log("업로드된 파일:", file);
		setModalOpen(false);
	};

	return (
		<>
			<DocumentListPage
				title="기준 문서 일람"
				rows={documents}
				columns={DOC_COLUMNS}
				tabs={categories}
				showNewButton={role === "admin"}
				onNewDocClick={handleNewStandardDoc}
				onRowView={handleViewDoc}
				onRowDelete={handleDelete}
				loading={loading}
				tabValue={tabValue}
				onTabChange={(e, newValue) => setTabValue(newValue)}
				error={error}
			/>

			{/* 파일 업로드 모달 */}
			<FileUploadModal open={modalOpen} onClose={() => setModalOpen(false)} onUpload={handleUpload} />
		</>
	);
}

export default StandardList;
