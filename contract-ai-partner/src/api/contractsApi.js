import axios from "axios";

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

// 계약 문서 업로드
export const uploadContractDoc = async (categoryId, file, onUploadProgress) => {
    try {
        const formData = new FormData();

        formData.append("file", file);

        const response = await apiClient.post(
            `/agreements/upload/${categoryId}`,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress
            }
        );

        console.log(response.data.data.id);
        return response.data.data.id;
    } catch (error) {
        console.error(
            `계약 문서 업로드(${categoryId}) 실패:`,
            error.code,
            error.message
        );
        throw error;
    }
};

// 계약 문서 AI 분석 요청
export const requestContractAnalysis = async (contractId) => {
    try {
        const response = await apiClient.patch(
            `/agreements/analysis/${contractId}`
        );

        console.log(response.data.data);
        return response.data.data;
    } catch (error) {
        console.error(
            `계약 문서 AI 분석(${contractId}) 실패:`,
            error.code,
            error.message
        );
        throw error;
    }
};

// 전체 계약 문서 조회
export const fetchAllContractDocs = async () => {
    try {
        const response = await apiClient.get("/agreements");

        return response.data.data;
    } catch (error) {
        console.error("전체 계약 문서 조회 실패:", error);
        throw error;
    }
};

// 카테고리별 계약 문서 조회
export const fetchContractsByCategory = async (categoryId) => {
    try {
        const response = await apiClient.get(
            `/agreements?category-id=${categoryId}`
        );

        return response.data.data;
    } catch (error) {
        console.error(`카테고리(${categoryId}) 계약 문서 조회 실패:`, error);
        throw error;
    }
};

// 이름으로 계약 문서 검색
export const fetchContractsByName = async (name) => {
    try {
        const response = await apiClient.get(
            `/agreements?name=${encodeURIComponent(name)}`
        );

        return response.data.data;
    } catch (error) {
        console.error(`계약 문서 이름(${name}) 검색 실패:`, error);
        throw error;
    }
};

// 이름 + 카테고리로 계약 문서 검색
export const fetchContractsByNameAndCategory = async (name, categoryId) => {
    try {
        const response = await apiClient.get(
            `/agreements?category-id=${categoryId}&name=${encodeURIComponent(
                name
            )}`
        );

        return response.data.data;
    } catch (error) {
        console.error(
            `계약 문서 이름(${name}) + 카테고리(${categoryId}) 검색 실패:`,
            error
        );
        throw error;
    }
};

// 단일 계약 문서 조회
export const fetchAgreementDetail = async (id) => {
    try {
        const response = await apiClient.get(`/agreements/${id}`);

        return response.data.data;
    } catch (error) {
        console.error("API 호출 중 에러:", error, error.message);
        throw error;
    }
};

// 계약 문서 삭제
export const deleteContractDoc = async (id) => {
    try {
        await apiClient.delete(`/agreements/${id}`);
    } catch (error) {
        console.error(`계약 문서(${id}) 삭제 실패:`, error);
        throw error;
    }
};

// 업로드 취소
export const cancelUploadedContract = async (id) => {
    try {
        await apiClient.delete(`/agreements/upload/${id}`);
        console.log(`계약 문서(${id}) 업로드 취소 완료`);
    } catch (error) {
        console.error(`계약 문서(${id}) 업로드 취소 실패:`, error);
        throw error;
    }
};

// AI 분석 보고서 데이터 가져오기
export const fetchAIReport = async (id) => {
    try {
        const response = await apiClient.get(`/agreements/analysis/${id}`);

        console.log(
            `계약 문서(${id}) AI 분석 보고서${response.data.data} 로딩 완료`
        );
        return response.data.data;
    } catch (error) {
        console.error(`계약 문서(${id}) AI 분석 보고서 로딩 실패:`, error);
        throw error;
    }
};
