// src/hooks/useDocumentList.js
import { useState, useEffect } from "react";

const useDocumentList = (
    categoryId,
    fetchFunction,
    fetchAllFunction,
    mapper,
) => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setError(null);
            setLoading(true);
            try {
                const data = categoryId
                    ? await fetchFunction(categoryId)
                    : await fetchAllFunction();

                // 데이터가공 함수(mapper)가 있으면 가공 적용
                const formattedData = mapper ? mapper(data) : data;

                setDocuments(formattedData);

                if (!data || data.length === 0) {
                    console.warn(
                        "⚠️ 빈 데이터 응답! setError는 호출되지 않음.",
                    );
                }
            } catch (e) {
                console.error("❌ API 호출 실패:", e);
                setError(`기준 문서 카테고리(${categoryId}) 조회 실패`);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [categoryId, fetchFunction, fetchAllFunction, mapper]);

    return { documents, loading, error };
};

export default useDocumentList;
