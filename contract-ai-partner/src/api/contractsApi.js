import axios from "axios";

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// 전체 계약 문서 조회
export const fetchAllContracts = async () => {
    try {
        const response = await apiClient.get("/agreement");

        return response.data.data;
    } catch (error) {
        console.error("계약 문서 전체 조회 실패:", error);
        throw error;
    }
};

// 카테고리별 계약 문서 조회
export const fetchContractsByCategory = async (categoryId) => {
    try {
        const response = await apiClient.get(
            `/agreement?category-id=${categoryId}`,
        );

        return response.data.data;
    } catch (error) {
        console.error(`계약 문서 카테고리(${categoryId}) 조회 실패:`, error);
        throw error;
    }
};
