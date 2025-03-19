// src/pages/StandardList.js
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import RoleContext from "../contexts/RoleContext";
import DocumentListPage from "../components/DocumentListPage";
import DOC_COLUMNS from "../constants/docColumns";
import { useCategory } from "../contexts/CategoryContext";
import useDocumentList from "../hooks/useDocumentList";
import {
    fetchAllStandardDocs,
    fetchStandardsByCategory,
    fetchStandardsByName,
    deleteStandardDoc
} from "../api/standardsApi";
import { mapStandardDocsForGrid } from "../utils/docUtils";

import FileUploadModal from "../components/FileUploadModal";

function StandardList() {
    const role = useContext(RoleContext);
    const navigate = useNavigate();

    // 모달 창 상태
    const [modalOpen, setModalOpen] = useState(false);

    const { categories } = useCategory();

    // 탭 상태 관리
    const [tabValue, setTabValue] = useState(0);
    const selectedCategoryId = categories[tabValue]?.id || null;

    // 문서 리스트 가져오는 커스텀 훅
    const { documents, loading, error, setDocuments } = useDocumentList(
        selectedCategoryId,
        fetchStandardsByCategory,
        fetchAllStandardDocs,
        mapStandardDocsForGrid
    );

    console.log(documents);

    // 문서 보기 클릭
    const handleViewDoc = (row) => {
        navigate(`/standards/${row.id}`, {
            state: {
                docName: row.name,
                category: row.category,
                docType: row.iconType
            }
        });
    };

    // 새 문서 버튼 클릭
    const handleNewStandardDoc = () => {
        setModalOpen(true);
    };

    // 문서 삭제 버튼 클릭
    const handleDelete = async (rowId) => {
        // 우선 사용자에게 삭제 확인
        if (!window.confirm(`정말로 문서 ID ${rowId}를 삭제하시겠습니까?`)) {
            return;
        }
        try {
            // API 콜
            await deleteStandardDoc(rowId);
            alert("문서가 성공적으로 삭제되었습니다.");

            // 최신 목록 불러오기 (카테고리가 있을 때 vs 없을 때 분기)
            let updatedDocs;

            if (selectedCategoryId) {
                updatedDocs =
                    await fetchStandardsByCategory(selectedCategoryId);
            } else {
                updatedDocs = await fetchAllStandardDocs();
            }
            setDocuments(mapStandardDocsForGrid(updatedDocs));
        } catch (deleteError) {
            console.error("삭제 중 오류:", deleteError);
            alert("문서를 삭제하지 못했습니다. 다시 시도해주세요.");
        }
    };

    // 파일 업로드
    const handleUpload = (file) => {
        console.log("업로드된 파일:", file);
        setModalOpen(false);
    };

    // 문서 이름 검색
    const handleSearch = async (keyword) => {
        try {
            let data;

            if (!keyword.trim()) {
                // 검색어가 없으므로 카테고리 기준으로 조회
                data = selectedCategoryId
                    ? await fetchStandardsByCategory(selectedCategoryId)
                    : await fetchAllStandardDocs();
            } else {
                // 검색어가 있으므로 이름 검색
                data = await fetchStandardsByName(keyword);
            }

            // 검색 후 데이터 매핑
            const mapped = mapStandardDocsForGrid(data);

            setDocuments(mapped);
        } catch (searchError) {
            console.error("문서 검색 중 오류가 발생했습니다:", searchError);
            // 필요하다면 에러 상태 업데이트 로직 추가
        }
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
                onSearch={handleSearch}
            />

            {/* 파일 업로드 모달 */}
            <FileUploadModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onUpload={handleUpload}
            />
        </>
    );
}

export default StandardList;
