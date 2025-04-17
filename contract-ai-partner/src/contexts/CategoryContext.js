import React, { createContext, useContext, useState, useEffect } from "react";
import { getCategories } from "../api/categoryApi";

// Context 생성
const CategoryContext = createContext();

// Context Provider
export const CategoryProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 카테고리 목록을 API에서 가져오는 함수
    const fetchCategories = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await getCategories();

            console.log(data);

            // 전체 카테고리
            const all = {
                id: 0,
                name: "전체",
                countOfStandards: 0,
                countOfAgreements: 0,
                createdAt: ""
            };

            // 필요한 데이터 가공 후 상태에 저장
            setCategories([all, ...data]);
        } catch (fetchError) {
            setError("카테고리를 불러오지 못했습니다.");
            console.error("카테고리 조회 오류:", fetchError);
        } finally {
            setLoading(false);
        }
    };

    // 컴포넌트가 마운트될 때 카테고리 가져오기
    useEffect(() => {
        fetchCategories();
    }, [categories]);

    return (
        <CategoryContext.Provider
            value={{ categories, loading, error, fetchCategories }}
        >
            {children}
        </CategoryContext.Provider>
    );
};

// useCategory 커스텀 훅
export const useCategory = () => useContext(CategoryContext);
