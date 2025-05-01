import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import RoleContext from "../contexts/RoleContext";
import { useCategory } from "../contexts/CategoryContext";

import DocumentListPage from "../components/DocumentListPage";
import FileUploadModal from "../components/FileUploadModal";

import DOC_COLUMNS from "../constants/docColumns";

import {
    uploadContractDoc,
    requestContractAnalysis,
    fetchAllContractDocs,
    fetchContractsByCategory,
    fetchContractsByName,
    fetchContractsByNameAndCategory,
    deleteContractDoc,
    cancelUploadedContract
} from "../api/contractsApi"; // 계약 문서 API 함수들
import { mapDocsForGrid } from "../utils/docUtils"; // 전처리 함수

function ContractList() {
    const {role} = useContext(RoleContext);
    const navigate = useNavigate();
    const { categories } = useCategory();

    const [modalOpen, setModalOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [tabValue, setTabValue] = useState(0);

    const selectedCategoryId = categories[tabValue]?.id || null;

    const fetchDocuments = async () => {
        const trimmedSearch = searchValue.trim();

        if (trimmedSearch) {
            if (selectedCategoryId && selectedCategoryId !== 0) {
                const data = await fetchContractsByNameAndCategory(
                    trimmedSearch,
                    selectedCategoryId
                );

                return mapDocsForGrid(data);
            }
            const data = await fetchContractsByName(trimmedSearch);

            return mapDocsForGrid(data);
        }

        if (selectedCategoryId && selectedCategoryId !== 0) {
            const data = await fetchContractsByCategory(selectedCategoryId);

            return mapDocsForGrid(data);
        }

        const data = await fetchAllContractDocs();

        return mapDocsForGrid(data);
    };

    const {
        data: documents = [],
        isLoading,
        isError,
        refetch
    } = useQuery({
        queryKey: ["contractDocuments", selectedCategoryId, searchValue],
        queryFn: fetchDocuments,
        refetchInterval: (query) => {
            if (!query.state.data) return false;
            return query.state.data.some((doc) => doc.status === "AI 분석 중")
                ? 5000
                : false;
        },
        refetchOnWindowFocus: false,
        staleTime: 0
    });

    const handleViewDoc = (row) => {
        navigate(`/agreements/${row.id}`, {
            state: {
                docName: row.name,
                category: row.category,
                docType: row.iconType
            }
        });
    };

    const handleNewDocClick = () => {
        setModalOpen(true);
    };

    const handleUpload = (file) => {
        console.log("업로드된 계약 문서:", file);
        setModalOpen(false);
        refetch();
    };

    const handleDelete = async (rowId) => {
        if (!window.confirm(`정말로 계약 문서 ID ${rowId}를 삭제하시겠습니까?`))
            return;
        try {
            await deleteContractDoc(rowId);
            alert("계약 문서가 성공적으로 삭제되었습니다.");
            refetch();
        } catch (err) {
            console.error("삭제 중 오류:", err);
            alert("계약 문서를 삭제하지 못했습니다. 다시 시도해주세요.");
        }
    };

    const handleSearch = (keyword) => {
        setSearchValue(keyword);
    };

    return (
        <>
            <DocumentListPage
                title="계약 문서 일람"
                rows={documents}
                columns={DOC_COLUMNS}
                tabs={categories}
                showNewButton={role !== "admin"}
                onNewDocClick={handleNewDocClick}
                onRowView={handleViewDoc}
                onRowDelete={handleDelete}
                loading={isLoading}
                tabValue={tabValue}
                onTabChange={(e, newValue) => setTabValue(newValue)}
                error={isError ? "계약 문서 목록 로딩 중 오류 발생" : null}
                onSearch={handleSearch}
            />

            <FileUploadModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onUpload={handleUpload}
                uploadApi={uploadContractDoc}
                onRequestAnalysis={requestContractAnalysis}
                onDeleteFile={cancelUploadedContract}
            />
        </>
    );
}

export default ContractList;
