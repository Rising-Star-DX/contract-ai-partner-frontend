import axios from "axios";

const apiClient = axios.create({
	baseURL: process.env.REACT_APP_API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

// 기준 문서 리스트 조회
export const fetchStandardDocs = async () => {
	const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/standards`;

	// 호출 직전에 API URL 콘솔에 출력
	console.log("API 호출 URL:", apiUrl);

	try {
		const response = await apiClient.get("/standards");

		console.log(response.data.data);

		return response.data.data; // data 필드 반환
	} catch (error) {
		console.error("기준 문서 조회 실패:", error);
		throw error;
	}
};

export const a = "";
