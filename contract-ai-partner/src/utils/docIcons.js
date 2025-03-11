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
export default function getDocIcon(iconType) {
	switch (iconType?.toUpperCase()) {
		case "DOC":
			return DocIcon;
		case "JPG":
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
}
