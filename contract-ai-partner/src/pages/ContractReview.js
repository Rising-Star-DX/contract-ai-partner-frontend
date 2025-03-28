import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";

// API
import { fetchAgreementDetail } from "../api/contractsApi";

import MainLayout from "../layouts/MainLayout";

// 하위 컴포넌트
import ReviewHeader from "../components/contractReview/ReviewHeader";
import ReviewTabs from "../components/contractReview/ReviewTabs";
import ReviewContent from "../components/contractReview/ReviewContent";

function ContractReview() {
    // 라우팅 시 전달된 state 꺼내기
    const location = useLocation();
    const { category, docName, docType } = location.state || {};

    const { id } = useParams();

    const [agreementData, setAgreementData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchContractData = async (contractId) => {
        try {
            const data = await fetchAgreementDetail(contractId);

            setAgreementData(data);
            console.log("데이터 로딩 성공:", data);
        } catch (error) {
            console.error("데이터 로딩 실패:", error);
        }
    };

    useEffect(() => {
        setLoading(true);
        // 최초 1회 데이터 불러오기
        fetchContractData(id).finally(() => {
            setLoading(false);
        });
    }, [id]);

    useEffect(() => {
        let intervalId;

        if (agreementData?.status === "ANALYZING") {
            intervalId = setInterval(() => {
                // "ANALYZING" 상태가 계속 유지되는 동안만 주기적으로 데이터 재호출
                fetchContractData(id);
            }, 5000);
        }

        // 상태가 ANALYZING가 아닐 때 혹은 컴포넌트 unmount 시에는 interval 해제
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [agreementData?.status, id]);

    if (loading) {
        return (
            <MainLayout>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "80vh"
                    }}
                >
                    <CircularProgress />
                </Box>
            </MainLayout>
        );
    }

    // API에서 받아온 데이터를 사용하거나, location state 데이터가 존재하면 우선 사용
    const headerData = {
        category: category || agreementData.categoryName,
        docName: docName || agreementData.name,
        docType: docType || agreementData.type
    };

    return (
        <MainLayout>
            {/* 헤더 (문서 제목, 카테고리 > 문서명.타입) */}
            <ReviewHeader {...headerData} />

            {/* 탭 영역 (원본 / 검토 결과 등) */}
            <ReviewTabs />

            {/* 본문 (좌: 원본, 우: 검토 결과) */}
            <ReviewContent agreementData={agreementData} />
        </MainLayout>
    );
}

export default ContractReview;
