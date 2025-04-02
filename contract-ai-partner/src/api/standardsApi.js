import axios from "axios";

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

export const uploadStandardDoc = async (categoryId, file, onUploadProgress) => {
    try {
        // 예: /standards/upload/123
        const formData = new FormData();

        formData.append("file", file);

        const response = await apiClient.post(
            `/standards/upload/${categoryId}`,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress
            }
        );

        console.log("계약서 업로드 완료", response.data.data.id);

        return response.data.data.id; // 문서에 대한 id 반환
    } catch (error) {
        console.error(
            `기준 문서 s3 업로드(${categoryId}) 실패:`,
            error.code,
            error.message
        );
        throw error;
    }
};

export const requestAnalysis = async (standardId) => {
    console.log(
        `${process.env.REACT_APP_API_BASE_URL}/standards/analysis/${standardId}`
    );

    try {
        // 예: /standards/analysis/123
        const response = await apiClient.patch(
            `/standards/analysis/${standardId}`
        );

        console.log(response.data.data);

        return response.data.data; // AI 분석 결과에 대한 응답값
    } catch (error) {
        console.error(
            `AI 분석 요청(${standardId}) 실패:`,
            error.code,
            error.message
        );
        throw error;
    }
};

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

// 이름으로 기준 문서 검색
export const fetchStandardsByName = async (name) => {
    try {
        const response = await apiClient.get(
            `/standards?name=${encodeURIComponent(name)}`
        );

        return response.data.data;
    } catch (error) {
        console.error(`기준 문서 이름(${name}) 검색 실패:`, error);
        throw error;
    }
};

// 이름 + 카테고리로 기준 문서 검색
export const fetchStandardsByNameAndCategory = async (name, categoryId) => {
    console.log(
        `/standards?category-id=${categoryId}&name=${encodeURIComponent(name)}`
    );

    try {
        const response = await apiClient.get(
            `/standards?category-id=${categoryId}&name=${encodeURIComponent(
                name
            )}`
        );

        console.log(name, categoryId, response.data.data);

        return response.data.data;
    } catch (error) {
        console.error(
            `기준 문서 이름(${name}) + 카테고리(${categoryId}) 검색 실패:`,
            error
        );
        throw error;
    }
};

// 단일 기준 문서 조회
export const fetchStandardDocById = async (id) => {
    try {
        console.log(`${process.env.REACT_APP_API_BASE_URL}/standards/${id}`);
        const response = await apiClient.get(`/standards/${id}`);

        return response.data.data;
    } catch (error) {
        console.error(`기준 문서(${id}) 조회 실패:`, error);
        throw error;
    }
};

// 기준 문서 삭제
export const deleteStandardDoc = async (id) => {
    try {
        await apiClient.delete(`/standards/${id}`);
    } catch (error) {
        console.error(`기준 문서(${id}) 삭제 실패:`, error);
        throw error;
    }
};

// 기준 문서 업로드 취소
export const cancelUploadedDoc = async (id) => {
    try {
        await apiClient.delete(`/standards/upload/${id}`);

        console.log(`기준 문서(${id}) 업로드 취소 완료`);
    } catch (error) {
        console.error(`기준 문서(${id}) 업로드 취소 실패:`, error);
        throw error;
    }
};
