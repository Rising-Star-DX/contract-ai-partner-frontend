// src/pages/StandardDetail.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";

// PDF 뷰어 관련
import { Worker, Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

import MainLayout from "../layouts/MainLayout";
// 새로 추가된 api
import { fetchStandardDocById } from "../api/standardsApi";

function StandardDetail() {
    const { id } = useParams();
    const [docData, setDocData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);

                // 단일 기준 문서 API 호출
                const data = await fetchStandardDocById(id);

                setDocData(data);
            } catch (err) {
                console.error("문서 상세 조회 실패:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    if (loading) return <div>로딩 중입니다...</div>;
    if (error) return <div>문서를 불러오는 중 오류가 발생했습니다.</div>;
    if (!docData) return null;

    const { name, url, type, status } = docData;

    // 여기서는 PDF 유형이면서 업로드가 성공(SUCCESS)해야만 표시하도록 함
    const isPdf = type === "PDF" && status === "SUCCESS" && url;

    return (
        <MainLayout>
            <Box sx={{ p: 4 }}>
                <Box
                    sx={{
                        flex: 1,
                        display: "flex", // 수정된 부분: flex layout 적용
                        flexDirection: "row", // 수정된 부분: 가로(행) 배치
                        alignItems: "baseline",
                        gap: 2
                    }}
                >
                    <Typography variant="h4" fontWeight="bold" mb={2}>
                        기준 문서 상세
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        {name}
                    </Typography>
                </Box>

                {isPdf ? (
                    <Box
                        sx={{
                            height: "80vh",
                            border: "1px solid #ddd",
                            overflow: "hidden"
                        }}
                    >
                        {/* PDF.js Worker 파일 로드 */}
                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                            <Viewer
                                fileUrl={url}
                                defaultScale={SpecialZoomLevel.PageWidth}
                            />
                        </Worker>
                    </Box>
                ) : (
                    <Typography color="error" mt={2}>
                        PDF 형식이 아니거나 업로드가 완료되지 않았습니다.
                    </Typography>
                )}
            </Box>
        </MainLayout>
    );
}

export default StandardDetail;
