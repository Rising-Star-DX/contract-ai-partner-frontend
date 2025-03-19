import axios from "axios";

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

// 기준 문서 리스트 조회
export const fetchAllStandardDocs = async () => {
    console.log(`${process.env.REACT_APP_API_BASE_URL}/standards`);

    try {
        const response = await apiClient.get("/standards");

        return response.data.data; // data 필드 반환
    } catch (error) {
        console.error("기준 문서 조회 실패:", error);
        throw error;
    }
};

// 카테고리별 기준 문서 리스트 조회
export const fetchStandardsByCategory = async (categoryId) => {
    try {
        const response = await apiClient.get(
            `/standards?category-id=${categoryId}`
        );

        return response.data.data;
    } catch (error) {
        console.error(`기준 문서 카테고리(${categoryId}) 조회 실패:`, error);
        throw error;
    }
};
