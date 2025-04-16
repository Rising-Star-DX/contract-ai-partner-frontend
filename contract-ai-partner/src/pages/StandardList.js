import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Box } from "@mui/material";

import FileUploadModal from "../components/FileUploadModal";
import DocumentListPage from "../components/DocumentListPage";
import StandardSideSheet from "../components/admin/StandardSideSheet";

import RoleContext from "../contexts/RoleContext";
import DOC_COLUMNS from "../constants/docColumns";
import { useCategory } from "../contexts/CategoryContext";
import {
    uploadStandardDoc,
    requestAnalysis,
    fetchAllStandardDocs,
    fetchStandardsByCategory,
    fetchStandardsByName,
    fetchStandardsByNameAndCategory,
    deleteStandardDoc,
    cancelUploadedDoc
} from "../api/standardsApi";
import { mapDocsForGrid } from "../utils/docUtils";

function StandardList() {
    const role = useContext(RoleContext);
    const navigate = useNavigate();

    // 모달 창 상태
    const [modalOpen, setModalOpen] = useState(false);

    const { categories } = useCategory();

    // 검색 상태
    const [searchValue, setSearchValue] = useState("");

    // 탭 상태 관리
    const [tabValue, setTabValue] = useState(0);
    const selectedCategoryId = categories[tabValue]?.id || null;

    // 선택된 문서의 관리자 사이드 시트
    const [selectedDoc, setSelectedDoc] = useState(null);

    // 검색 키워드 + 카테고리를 종합해서 한 번에 불러오는 함수
    const fetchDocuments = async () => {
        // 검색어
        const trimmedSearch = searchValue.trim();

        // 만약 이름으로 검색 중이면
        if (trimmedSearch) {
            // 만약 카테고리도 지정되어 있다면 이름과 카테고리로 조회
            if (selectedCategoryId && selectedCategoryId !== 0) {
                const data = await fetchStandardsByNameAndCategory(
                    trimmedSearch,
                    selectedCategoryId
                );

                return mapDocsForGrid(data);
            }

            // 그렇지 않으면 이름으로만 조회
            const data = await fetchStandardsByName(trimmedSearch);

            return mapDocsForGrid(data);
        }

        if (selectedCategoryId && selectedCategoryId !== 0) {
            const data = await fetchStandardsByCategory(selectedCategoryId);

            return mapDocsForGrid(data);
        }

        const data = await fetchAllStandardDocs();

        return mapDocsForGrid(data);
    };

    // useQuery 훅 - React Query
    const {
        data: documents = [], // 문서 목록 (기본값 [])
        isLoading,
        isError,
        refetch
    } = useQuery({
        queryKey: ["documents", searchValue], // 캐시 키
        queryFn: fetchDocuments, // API 호출 함수
        // 5초마다 자동 리페치 (폴링)
        refetchInterval: (query) => {
            if (!query.state.data) return false;
            // data에 IN_PROGRESS가 하나라도 있으면 5초
            const inProgress = query.state.data.some(
                (doc) => doc.status === "AI 분석 중"
            );

            if (inProgress) {
                console.log("AI 분석 중 존재");
                return 5000;
            }
            return false; // 없으면 폴링 해제
        },
        // 컴포넌트가 포커스될 때 자동 리페치
        refetchOnWindowFocus: false,
        // 데이터를 최대로 몇 초 동안 캐시에 둬서 stale 상태를 방지할지 등등...
        staleTime: 0
    });

    // 문서 보기 클릭
    const handleViewDoc = (row) => {
        if (role === "admin") {
            // [수정됨] navigate 대신 selectedDoc 세팅
            console.log("관리자 문서보기 클릭");

            setSelectedDoc({
                id: row.id,
                name: row.name,
                category: row.category,
                iconType: row.iconType,
                content: "테스트테스트테스트"
            });
        } else {
            navigate(`/standards/${row.id}`, {
                state: {
                    docName: row.name,
                    category: row.category,
                    docType: row.iconType
                }
            });
        }
    };

    // 관리자용 사이드 시트 닫기
    const handleCloseSheet = () => {
        setSelectedDoc(null);
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

            // 삭제 후 문서 목록 다시 불러오기
            refetch();
        } catch (deleteError) {
            console.error("삭제 중 오류:", deleteError);
            alert("문서를 삭제하지 못했습니다. 다시 시도해주세요.");
        }
    };

    // 파일 업로드
    const handleUpload = (file) => {
        console.log("업로드된 파일:", file);
        setModalOpen(false);
        refetch();
    };

    // 문서 이름 검색
    const handleSearch = (keyword) => {
        setSearchValue(keyword);
        // searchValue 값이 바뀌면 queryKey 변경으로 자동 refetch
    };

    return (
        <Box sx={{ width: "100%" }}>
            <DocumentListPage
                title="기준 문서 일람"
                rows={documents}
                columns={DOC_COLUMNS}
                tabs={categories}
                showNewButton={role === "admin"}
                onNewDocClick={handleNewStandardDoc}
                onRowView={handleViewDoc}
                onRowDelete={handleDelete}
                loading={isLoading}
                tabValue={tabValue}
                onTabChange={(e, newValue) => setTabValue(newValue)}
                error={isError ? "문서 목록 로딩 중 오류 발생" : null}
                onSearch={handleSearch}
                // 사이드 시트 열림 여부
                sideSheetOpen={Boolean(selectedDoc)}
                // 사이드 시트 내용
                sideSheet={
                    selectedDoc ? (
                        <StandardSideSheet
                            doc={selectedDoc}
                            onClose={handleCloseSheet}
                        />
                    ) : null
                }
            />

            {/* 파일 업로드 모달 */}
            <FileUploadModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onUpload={handleUpload}
                uploadApi={uploadStandardDoc}
                onRequestAnalysis={requestAnalysis}
                onDeleteFile={cancelUploadedDoc}
            />
        </Box>
    );
}

export default StandardList;
