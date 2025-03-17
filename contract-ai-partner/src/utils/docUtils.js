import DocIcon from "../assets/images/ic_doc.png";
import JpgIcon from "../assets/images/ic_jpg.png";
import PdfIcon from "../assets/images/ic_pdf.png";
import PngIcon from "../assets/images/ic_png.png";
import TxtIcon from "../assets/images/ic_txt.png";
import XlsIcon from "../assets/images/ic_xls.png";

/**
 * 문서 확장자 유형(예: \"DOC\", \"PDF\", \"XLS\" 등)에 따라 해당 아이콘을 반환.
 * @param {string} iconType
 * @returns icon URL
 */
export const getDocIcon = type => {
	switch (type?.toUpperCase()) {
		case "DOC" || "DOCX":
			return DocIcon;
		case "JPG" || "JPEG":
			return JpgIcon;
		case "PDF":
			return PdfIcon;
		case "PNG":
			return PngIcon;
		case "TXT":
			return TxtIcon;
		case "XLS":
			return XlsIcon;
		default:
			return DocIcon; // 기본 아이콘
	}
};

// 날짜 포맷팅 함수
export const formatDate = dateStr => {
	const date = new Date(dateStr);

	return date.toLocaleDateString("ko-KR", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	});
};

// 상태 처리 함수
export const getStatusLabel = status => {
	const statusMap = {
		UPLOADING: "파일 업로드 중",
		"FILE-FAILED": "파일 업로드 실패",
		ANALYZING: "AI 분석 중",
		"AI-FAILED": "AI 분석 실패",
		SUCCESS: "AI 분석 완료",
		null: "상태 정보 없음",
	};

	return statusMap[status];
};

// API 데이터를 DataGrid 형식으로 변환
export const mapStandardDocsForGrid = data =>
	data.map(doc => ({
		id: doc.id,
		name: doc.name,
		iconType: doc.type,
		status: getStatusLabel(doc.status),
		uploadDate: formatDate(doc.createdAt),
	}));
