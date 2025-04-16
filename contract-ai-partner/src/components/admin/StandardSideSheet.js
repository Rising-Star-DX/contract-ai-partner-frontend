import React, { useState, useEffect } from "react";

import { Worker, Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

import {
    Paper,
    Box,
    Typography,
    IconButton,
    Tabs,
    Tab,
    Divider
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { getDocIcon } from "../../utils/docUtils";
import { fetchAdminStandardDocById } from "../../api/standardsApi";

function StandardSideSheet({ docId, onClose }) {
    // 문서 데이터
    const [docData, setDocData] = useState(null);
    // 탭 상태
    const [tabValue, setTabValue] = useState(0);
    // 페이지 인덱스
    const [pageIndex, setPageIndex] = useState(0);

    useEffect(() => {
        if (!docId) return;

        const loadDoc = async () => {
            try {
                // /standards/admin/{id} 로부터 문서 상세 조회
                const data = await fetchAdminStandardDocById(docId);

                setDocData(data);
                setPageIndex(0);
            } catch (error) {
                console.error("관리자 문서 상세 조회 오류:", error);
            }
        };

        loadDoc();
    }, [docId]);

    if (!docData) {
        return null; // 로딩 상태 표시 등으로 대체 가능
    }

    const { name, type, url, contents } = docData;

    // PDF인지 판별
    const isPdf = type === "PDF";

    const handleChangeTab = (event, newValue) => {
        setTabValue(newValue);
    };

    // 페이지 이동 로직
    const handlePrevPage = () => {
        if (pageIndex > 0) {
            setPageIndex((prev) => prev - 1);
        }
    };
    const handleNextPage = () => {
        if (contents && pageIndex < contents.length - 1) {
            setPageIndex((prev) => prev + 1);
        }
    };

    return (
        <Paper
            sx={{
                width: "100%",
                height: "100%",
                borderRadius: 0,
                display: "flex",
                flexDirection: "column"
            }}
        >
            {/* 상단 헤더 */}
            <Box
                sx={{
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 4
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {/* 파일 아이콘 부분 */}
                    <img
                        src={getDocIcon(type)}
                        alt="PDF Icon"
                        style={{
                            width: 32,
                            height: 32,
                            marginLeft: 8,
                            marginRight: 16
                        }}
                    />
                    {/* 문서 이름 */}
                    <Typography
                        sx={{ fontFamily: "NanumSquareNeoHeavy", fontSize: 24 }}
                    >
                        {name}
                    </Typography>
                </Box>
                {/* 시트 닫기 버튼 */}
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </Box>

            {/* 탭 영역 */}
            <Tabs
                value={tabValue}
                onChange={handleChangeTab}
                textColor="primary"
                indicatorColor="primary"
                variant="fullWidth"
            >
                <Tab
                    label="추출 텍스트"
                    sx={{ fontFamily: "NanumSquareNeoExtraBold", fontSize: 20 }}
                />
                <Tab label="문서 프리뷰" sx={{ fontSize: 20 }} />
            </Tabs>

            {/* 탭 패널 영역 */}
            <Divider />
            <Box sx={{ flex: 1, overflowY: "auto", p: 4 }}>
                {tabValue === 0 && (
                    <Box>
                        {/* content 배열에 페이지별 텍스트가 있으므로 map으로 표시 */}
                        {Array.isArray(contents) && contents.length > 0 ? (
                            <>
                                {/* [수정됨] 페이지 내비게이션 영역 */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        mb: 2
                                    }}
                                >
                                    <IconButton
                                        onClick={handlePrevPage}
                                        disabled={pageIndex === 0}
                                    >
                                        <ArrowLeftIcon />
                                    </IconButton>
                                    <Typography sx={{ mx: 2 }}>
                                        {pageIndex + 1} / {contents.length}
                                    </Typography>
                                    <IconButton
                                        onClick={handleNextPage}
                                        disabled={
                                            pageIndex === contents.length - 1
                                        }
                                    >
                                        <ArrowRightIcon />
                                    </IconButton>
                                </Box>

                                {/* 현재 페이지 내용 표시 */}
                                <Box
                                    key={contents[pageIndex].page}
                                    sx={{ mb: 2 }}
                                >
                                    <Typography
                                        variant="body1"
                                        sx={{ whiteSpace: "pre-wrap", mt: 1 }}
                                    >
                                        {contents[pageIndex].content}
                                    </Typography>
                                </Box>
                            </>
                        ) : (
                            <Typography>추출된 텍스트가 없습니다.</Typography>
                        )}
                    </Box>
                )}
                {tabValue === 1 && (
                    <Box>
                        {isPdf ? (
                            // [수정됨] react-pdf-viewer를 이용해 PDF 표시
                            <Box
                                sx={{
                                    height: "80vh",
                                    border: "1px solid #ddd",
                                    overflow: "hidden"
                                }}
                            >
                                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                                    <Viewer
                                        fileUrl={url}
                                        defaultScale={
                                            SpecialZoomLevel.PageWidth
                                        }
                                    />
                                </Worker>
                            </Box>
                        ) : (
                            <Typography color="error" mt={2}>
                                PDF 형식이 아니거나 업로드가 완료되지
                                않았습니다.
                            </Typography>
                        )}
                    </Box>
                )}
            </Box>
        </Paper>
    );
}

export default StandardSideSheet;
