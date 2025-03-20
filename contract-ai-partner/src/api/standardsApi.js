import axios from "axios";

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

// 기준 문서 업로드 init
export const initStandardDoc = async (docBody) => {
    // docBody 예시: { name: "~~~에 대한 기준 문서.pdf", type: "PDF", categoryId: 123 }
    try {
        const response = await apiClient.post(
            "/standards/upload/init",
            docBody
        );

        console.log(response.data.data);

        return response.data.data; // { id: ..., ... } 등의 응답이 온다고 가정
    } catch (error) {
        console.error("기준 문서 업로드 init 실패:", error);
        throw error;
    }
};

// s3 파일 업로드 (/standards/upload/{id})
// onUploadProgress 콜백을 통해 업로드 진행률을 UI로 반영
export const uploadStandardFile = async (
    standardId,
    file,
    onUploadProgress
) => {
    try {
        // Multipart 전송
        const formData = new FormData();

        formData.append("file", file);

        const response = await apiClient.patch(
            `/standards/upload/${standardId}`,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress
            }
        );

        return response.data;
    } catch (error) {
        console.error(`기준 문서 업로드(${standardId}) 실패:`, error);
        throw error;
    }
};

export const requestAnalysis = async (standardId) => {
    console.log(
        `${process.env.REACT_APP_API_BASE_URL}//standards/analysis/${standardId}`
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

// 기준 문서 삭제
export const deleteStandardDoc = async (id) => {
    try {
        await apiClient.delete(`/standards/${id}`);
    } catch (error) {
        console.error(`기준 문서(${id}) 삭제 실패:`, error);
        throw error;
    }
};
