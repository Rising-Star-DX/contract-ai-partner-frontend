// src/pages/ContractReview.jsx
import React from "react";
import {useLocation} from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

// 하위 컴포넌트
import ReviewHeader from "../components/contractReview/ReviewHeader";
import ReviewTabs from "../components/contractReview/ReviewTabs";
import ReviewContent from "../components/contractReview/ReviewContent";

function ContractReview() {
	// 라우팅 시 전달된 state 꺼내기
	const location = useLocation();
	const {category, docName, docType} = location.state || {};

	return (
		<MainLayout>
			{/* 헤더 (문서 제목, 카테고리 > 문서명.타입) */}
			<ReviewHeader category={category} docName={docName} docType={docType} />

			{/* 탭 영역 (원본 / 검토 결과 등) */}
			<ReviewTabs />

			{/* 본문 (좌: 원본, 우: 검토 결과) */}
			<ReviewContent />
		</MainLayout>
	);
}

export default ContractReview;
