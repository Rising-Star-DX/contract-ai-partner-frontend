import axios from "axios";

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

// 카테고리 전체 조회
export const getCategories = async () => {
    try {
        const response = await apiClient.get("/categories");

        return response.data.data;
    } catch (error) {
        console.error("카테고리를 불러오는 중 오류가 발생했습니다:", error);
        throw error;
    }
};

// 검색 기능 (카테고리명으로 필터링)
export const fetchCategoriesByName = async (name) => {
    try {
        const response = await apiClient.get(
            `/categories?name=${encodeURIComponent(name)}`
        );

        return response.data.data;
    } catch (error) {
        console.error("카테고리를 검색하는 중 오류가 발생했습니다:", error);
        throw error;
    }
};

// 새 카테고리 생성
export const createCategory = async (newCategoryName) => {
    try {
        const response = await apiClient.post("/categories", newCategoryName);

        return response.data;
    } catch (error) {
        console.error("카테고리를 생성하는 중 오류가 발생했습니다:", error);
        throw error;
    }
};

// 카테고리 업데이트
export const updateCategory = async (categoryId, categoryName) => {
    try {
        const response = await apiClient.patch(
            `/categories/${categoryId}`,
            categoryName
        );

        return response.data;
    } catch (error) {
        console.error(
            "카테고리를 업데이트 하는 중 오류가 발생했습니다:",
            error
        );
        throw error;
    }
};

// 카테고리 삭제
export const deleteCategory = async (categoryId) => {
    try {
        const response = await apiClient.delete(`/categories/${categoryId}`);

        return response.data;
    } catch (error) {
        console.error("카테고리를 삭제하는 중 오류가 발생했습니다:", error);
        throw error;
    }
};

export const checkCategoryDocs = async (categoryId) => {
    try {
        const response = await apiClient.get(`/categories/${categoryId}`);

        return response.data?.data.result;
    } catch (error) {
        console.error("카테고리 문서 조회 중 오류:", error);
        throw error;
    }
};
