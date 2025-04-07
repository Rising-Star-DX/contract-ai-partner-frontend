import React, { useContext, useState } from "react";
// import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import RoleContext from "../contexts/RoleContext";

import DocumentListPage from "../components/DocumentListPage";
import CATEGORY_COLUMNS from "../constants/categoryColumns";

import mapCategoriesForGrid from "../utils/categoryUtils";

import {
    getCategories
    // fetchCategoriesByName,
    // createCategory,
    // deleteCategory
} from "../api/categoryApi"; // 카테고리 API 예시

function CategoryList() {
    const role = useContext(RoleContext);
    // const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState("");
    const [modalOpen, setModalOpen] = useState(false);

    const [tabValue, setTabValue] = useState(0);

    const fetchCategories = async () => {
        // const trimmedSearch = searchValue.trim();

        // if (trimmedSearch) {
        //     const data = await fetchCategoriesByName(trimmedSearch);

        //     return data; // 서버에서 받은 categories 데이터
        // }

        const data = await getCategories();

        console.log(data);

        return mapCategoriesForGrid(data);
    };

    const {
        data: categories = [],
        isLoading,
        isError
        // refetch
    } = useQuery({
        queryKey: ["categories", searchValue],
        queryFn: fetchCategories,
        refetchOnWindowFocus: false,
        staleTime: 0
    });

    // 카테고리 클릭(상세보기) 핸들러 예시
    const handleViewCategory = (row) => {
        // // 예: 카테고리 상세 페이지가 있다면 이동
        // navigate(`/categories/${row.id}`, {
        //     state: {
        //         categoryName: row.name
        //     }
        // });
    };

    // 새 카테고리 추가 모달 열기
    const handleNewCategory = () => {
        setModalOpen(true);
    };

    // 카테고리 업로드(모달 내에서 submit한 경우) 예시
    const handleUpload = async (newCategoryName) => {
        // try {
        //     await createCategory(newCategoryName);
        //     alert("카테고리가 성공적으로 생성되었습니다.");
        //     setModalOpen(false);
        //     refetch();
        // } catch (error) {
        //     console.error("카테고리 생성 중 오류:", error);
        //     alert("카테고리를 생성하지 못했습니다. 다시 시도해주세요.");
        // }
    };

    // 카테고리 삭제
    const handleDelete = async (rowId) => {
        // const confirmMsg = `정말로 카테고리 ID ${rowId}를 삭제하시겠습니까?`;
        // if (!window.confirm(confirmMsg)) {
        //     return;
        // }
        // try {
        //     await deleteCategory(rowId);
        //     alert("카테고리가 성공적으로 삭제되었습니다.");
        //     refetch();
        // } catch (err) {
        //     console.error("삭제 중 오류:", err);
        //     alert("카테고리를 삭제하지 못했습니다. 다시 시도해주세요.");
        // }
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
                onRowView={handleViewCategory}
                onRowDelete={handleDelete}
                loading={isLoading}
                tabValue={tabValue}
                onTabChange={handleTabChange}
                error={isError ? "카테고리 목록 로딩 중 오류 발생" : null}
                onSearch={handleSearch}
            />

            {modalOpen && (
                <div>
                    {/* 모달 컴포넌트 예시: 구현 방식에 따라 Modal, Dialog 등 자유롭게 사용 */}
                    <p>여기에 새 카테고리 등록 폼을 넣으세요.</p>
                    <button
                        type="button"
                        onClick={() => {
                            // 모달 내부에서 새 카테고리 명을 입력받았다고 가정
                            handleUpload("새 카테고리명 예시");
                        }}
                    >
                        등록
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setModalOpen(false);
                        }}
                    >
                        닫기
                    </button>
                </div>
            )}
        </>
    );
}

export default CategoryList;
