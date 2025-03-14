import React, {createContext, useContext /* useState  useEffect */} from "react";
// import axios from "axios";

// Context 생성
const CategoryContext = createContext();

// Context Provider
export const CategoryProvider = ({children}) => {
	// const [categories, setCategories] = useState([
	// 	"전체",
	// 	"R&D 계약",
	// 	"구매 계약",
	// 	"공사 계약",
	// 	"법령",
	// ]);
	// const [loading, setLoading] = useState(false);
	// const [error, setError] = useState(null);

	const categories = [{id: 1, name: "전체"}, {id: 2, name: "R&D 계약"}, {id: 3, name: "구매 계약"}, {id: 4, name: "공사 계약"}, {id: 5, name: "법령"}];
	const loading = false;
	const error = null;

	// API 가져오면 주석 해제
	// 카테고리 목록을 API에서 가져오는 함수
	// const fetchCategories = async () => {
	// 	try {
	// 		setLoading(true);
	// 		const response = await axios.get("/api/categories"); // 백엔드 API 엔드포인트

	// 		setCategories(response.data); // API 응답을 상태에 저장
	// 	} catch (error) {
	// 		setError("카테고리를 불러오지 못했습니다.");
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// };

	// // 컴포넌트가 마운트될 때 카테고리 가져오기
	// useEffect(() => {
	// 	fetchCategories();
	// }, []);

	return (
		<CategoryContext.Provider value={{categories, /* fetchCategories, */ loading, error}}>
			{children}
		</CategoryContext.Provider>
	);
};

// useCategory 커스텀 훅
export const useCategory = () => useContext(CategoryContext);
