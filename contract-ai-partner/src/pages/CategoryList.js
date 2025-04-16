import React, { useContext, useState } from "react";
// import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField
} from "@mui/material";

import RoleContext from "../contexts/RoleContext";

import DocumentListPage from "../components/DocumentListPage";
import CATEGORY_COLUMNS from "../constants/categoryColumns";

import mapCategoriesForGrid from "../utils/categoryUtils";

import {
    getCategories,
    fetchCategoriesByName,
    createCategory,
    deleteCategory
} from "../api/categoryApi"; // 카테고리 API 예시

function CategoryList() {
    const role = useContext(RoleContext);
    const [searchValue, setSearchValue] = useState("");
    const [modalOpen, setModalOpen] = useState(false);

    const [tabValue, setTabValue] = useState(0);

    const [newCategoryName, setNewCategoryName] = useState("");

    const fetchCategories = async () => {
        const trimmedSearch = searchValue.trim();

        if (trimmedSearch) {
            const data = await fetchCategoriesByName(trimmedSearch);

            return mapCategoriesForGrid(data); // 서버에서 받은 categories 데이터
        }

        const data = await getCategories();

        console.log(data);

        return mapCategoriesForGrid(data);
    };

    const {
        data: categories = [],
        isLoading,
        isError,
        refetch
    } = useQuery({
        queryKey: ["categories", searchValue],
        queryFn: fetchCategories,
        refetchOnWindowFocus: false,
        staleTime: 0
    });

    // 새 카테고리 추가 모달 열기
    const handleNewCategory = () => {
        setModalOpen(true);
    };

    // 카테고리 업로드(모달 내에서 submit한 경우) 예시
    const handleUpload = async () => {
        if (!modalOpen) {
            return;
        }

        try {
            if (!newCategoryName.trim()) {
                alert("카테고리 이름을 입력하세요.");
                return;
            }
            await createCategory(newCategoryName.trim());
            alert("카테고리가 성공적으로 생성되었습니다.");
            setModalOpen(false);
            setNewCategoryName("");
            refetch();
        } catch (error) {
            console.error("카테고리 생성 중 오류:", error);
            alert("카테고리를 생성하지 못했습니다. 다시 시도해주세요.");
        }
    };

    // 카테고리 삭제
    const handleDelete = async (rowId) => {
        const confirmMsg = `정말로 카테고리 ID ${rowId}를 삭제하시겠습니까?`;

        if (window.confirm(confirmMsg)) {
            try {
                await deleteCategory(rowId);
                alert("카테고리가 성공적으로 삭제되었습니다.");
                refetch();
            } catch (err) {
                console.error("삭제 중 오류:", err);
                alert("카테고리를 삭제하지 못했습니다. 다시 시도해주세요.");
            }
        }
    };

    // 검색 핸들러
    const handleSearch = (keyword) => {
        setSearchValue(keyword);
    };

    // 탭 변경(필요 시 사용, 탭을 제거할 거라면 문서ListPage의 tabs 자체를 제거해도 됨)
    const handleTabChange = (_event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <>
            <DocumentListPage
                title="카테고리 목록"
                rows={categories}
                columns={CATEGORY_COLUMNS} // import한 CATEGORY_COLUMNS 사용
                tabs={[]} // 탭이 필요 없으면 빈 배열 혹은 undefined
                showNewButton={role === "admin"} // admin이 아닐 경우 + 새 문서(카테고리) 버튼 노출
                onNewDocClick={handleNewCategory}
                onRowView={() => {}}
                onRowDelete={handleDelete}
                loading={isLoading}
                tabValue={tabValue}
                onTabChange={handleTabChange}
                error={isError ? "카테고리 목록 로딩 중 오류 발생" : null}
                onSearch={handleSearch}
            />

            {/* 새 카테고리 등록 모달 */}
            <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
                <DialogTitle>새 카테고리 등록</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="카테고리명"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setModalOpen(false)}>취소</Button>
                    <Button variant="contained" onClick={handleUpload}>
                        등록
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default CategoryList;
