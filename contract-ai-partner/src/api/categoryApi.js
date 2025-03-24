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

export const checkCategoryDocs = async (categoryId) => {
    try {
        const response = await apiClient.fetch(`/categories/${categoryId}`);

        if (!response.ok) {
            throw new Error("카테고리 조회 실패");
        }
        const data = await response.json();

        console.log(data);

        return data?.data.result;
    } catch (error) {
        console.error("카테고리 문서 조회 중 오류:", error);
        throw error;
    }
};
