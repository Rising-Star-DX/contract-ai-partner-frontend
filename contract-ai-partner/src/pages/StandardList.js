import React, {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

import RoleContext from "../contexts/RoleContext";

import DocumentListPage from "../components/DocumentListPage";
import DOC_COLUMNS from "../constants/docColumns";

import {fetchStandardDocs} from "../api/standardApi";
import {mapStandardDocsForGrid} from "../utils/docUtils";
import {useCategory} from "../contexts/CategoryContext";

function StandardList() {
	const role = useContext(RoleContext);
	const navigate = useNavigate();

	/* ###################
	 *					*
	 *	API 호출 관련	*
	 *					*
	 *###################*/

	// 기준 문서
	const [rows, setRows] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	// 카테고리 전체 조회
	const {categories} = useCategory();

	// 기준 문서 데이터 API 호출
	useEffect(() => {
		fetchStandardDocs()
			.then(data => {
				const formattedData = mapStandardDocsForGrid(data);

				setRows(formattedData);
			})
			.catch(error => console.error("기준 문서 로딩 중 오류 발생:", error))
			.finally(() => setIsLoading(false));
	}, []);

	// 문서 보기 클릭
	const handleViewDoc = row => {
		navigate(`/standards/${row.id}`, {
			state: {
				docName: row.name,
				category: row.category,
				docType: row.iconType,
			},
		});
	};

	// 새 문서 버튼
	const handleNewStandardDoc = () => {
		alert("새 기준 문서 등록 (Standard)");
	};

	// 삭제
	const handleDelete = id => {
		alert(`기준문서 ID ${id} 삭제 (예시)`);
	};

	return (
		<DocumentListPage
			title="기준 문서 일람"
			rows={rows}
			columns={DOC_COLUMNS}
			tabs={categories.map(c => c.name)}
			showNewButton={role === "admin"} // admin일 때만 새문서
			onNewDocClick={handleNewStandardDoc}
			onRowView={handleViewDoc}
			onRowDelete={handleDelete}
			loading={isLoading}
		/>
	);
}

export default StandardList;
