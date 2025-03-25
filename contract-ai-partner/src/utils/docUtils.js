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
export const getDocIcon = (type) => {
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

// 상태 처리 함수
export const getStatusLabel = (status) => {
    const statusMap = {
        UPLOADING: "업로드 중",
        "FILE-FAILED": "업로드 실패",
        ANALYZING: "AI 분석 중",
        "AI-FAILED": "AI 분석 실패",
        SUCCESS: "AI 분석 완료",
        null: "상태 정보 없음"
    };

    return statusMap[status];
};

// API 데이터를 DataGrid 형식으로 변환
export const mapDocsForGrid = (data) =>
    data &&
    data.map((doc) => ({
        id: doc.id,
        name: doc.name,
        category: doc.categoryName,
        iconType: doc.type,
        status: getStatusLabel(doc.status),
        uploadDate: doc.createdAt
    }));

// s3 URL을 실제 브라우저 접근 가능한 URL로 변환하는 함수
export const convertS3UrlToHttps = (s3Url) => {
    if (!s3Url.startsWith("s3://")) return s3Url;

    const urlWithoutProtocol = s3Url.replace("s3://", "");
    const bucketName = urlWithoutProtocol.split("/")[0];
    const objectPath = urlWithoutProtocol.split("/").slice(1).join("/");

    return `http://${bucketName}.s3.ap-northeast-2.amazonaws.com/${objectPath}`;
};
