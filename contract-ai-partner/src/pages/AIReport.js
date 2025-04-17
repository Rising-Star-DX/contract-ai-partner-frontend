import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
    Box,
    CircularProgress,
    Typography,
    Button,
    Stack
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import * as XLSX from "xlsx";
import saveAs from "file-saver";

import MainLayout from "../layouts/MainLayout";
import AIReportHeader from "../components/aiReport/AIReportHeader";
import AIReportSummary from "../components/aiReport/AIReportSummary";
import AI_REPORT_COLUMNS from "../constants/aiReportColumns";
import { fetchAIReport } from "../api/contractsApi";

function AIReport() {
    const { id } = useParams();

    const {
        data: aiReport,
        isLoading,
        isError,
        error,
        refetch
    } = useQuery({
        queryKey: ["aiReport", id],
        queryFn: () => fetchAIReport(id),
        refetchOnWindowFocus: false,
        staleTime: 60 * 1000
    });

    // ───────────────────────── 로딩 UI
    if (isLoading) {
        return (
            <MainLayout>
                <AIReportHeader />
                <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                    <CircularProgress />
                </Box>
            </MainLayout>
        );
    }

    // ───────────────────────── 에러 UI
    if (isError) {
        return (
            <MainLayout>
                <AIReportHeader />
                <Stack alignItems="center" mt={6} spacing={2}>
                    <Typography color="error">
                        보고서를 불러오지 못했습니다. {error?.message}
                    </Typography>
                    <Button variant="outlined" onClick={() => refetch()}>
                        다시 시도
                    </Button>
                </Stack>
            </MainLayout>
        );
    }

    // ───────────────────────── 성공 UI
    /* ------------------------- 중복 제거 로직 ------------------------- */
    const uniqueIncorrectTexts = [];
    const seenIds = new Set();

    aiReport.incorrectTexts.forEach((item) => {
        if (!seenIds.has(item.id)) {
            seenIds.add(item.id);
            uniqueIncorrectTexts.push(item);
        }
    });

    const rows = uniqueIncorrectTexts.map((item) => ({
        ...item,
        id: item.id // DataGrid 고유 ID
    }));

    /* ------------------------- Excel 다운로드 ------------------------- */
    const handleExcelDownload = () => {
        // 1) 메타 정보 시트
        const metaSheet = XLSX.utils.aoa_to_sheet([
            ["문서 유형", aiReport.categoryName],
            ["문서 이름", aiReport.name],
            ["전체 페이지", aiReport.totalPage],
            ["전체 문장", aiReport.totalChunks],
            ["위반 건수", rows.length]
        ]);

        // 2) 위반 문장 시트
        const dataForSheet = rows.map((r) => ({
            검출ID: r.id,
            페이지: r.currentPage,
            검출문장: r.incorrectText,
            신뢰도: `${r.accuracy.toFixed(1)}%`,
            검토의견: r.proofText,
            추천문장: r.correctedText
        }));
        const textSheet = XLSX.utils.json_to_sheet(dataForSheet);

        // 3) 워크북 생성 & 시트 추가
        const wb = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(wb, metaSheet, "요약");
        XLSX.utils.book_append_sheet(wb, textSheet, "위반_문장_목록");

        // 4) 파일 저장
        const wbBlob = XLSX.write(wb, { bookType: "xlsx", type: "array" });

        saveAs(
            new Blob([wbBlob], { type: "application/octet-stream" }),
            `${aiReport.name.replace(/\.pdf$/i, "")}_AI_분석.xlsx`
        );
    };

    return (
        <MainLayout>
            {/* 헤더 */}
            <AIReportHeader
                category={aiReport.categoryName}
                docName={aiReport.name}
                onDownload={handleExcelDownload}
            />

            {/* 메타 정보 요약 */}
            <AIReportSummary
                docType={aiReport.categoryName}
                totalPageNum={aiReport.totalPage}
                totalChunkNum={aiReport.totalChunks}
                violationChunkNum={rows.length}
            />

            {/* 위반 사항 테이블 */}
            <Box sx={{ height: 600, mt: 4 }}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                    위반 사항 목록
                </Typography>

                <DataGrid
                    rows={rows}
                    columns={AI_REPORT_COLUMNS}
                    disableRowSelectionOnClick
                    pageSizeOptions={[10, 25, 50]}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 10, page: 0 }
                        }
                    }}
                    sx={{
                        minHeight: "100%",
                        bgcolor: "white",
                        "& .MuiDataGrid-columnHeader": {
                            backgroundColor: "#E5E7E9"
                        },
                        "& .MuiDataGrid-columnHeaderTitle": {
                            fontSize: "20px",
                            fontWeight: 900
                        },
                        "& .MuiDataGrid-cell": {
                            backgroundColor: "#FFFFFF",
                            fontSize: "16px",
                            fontWeight: 400
                        }
                    }}
                />
            </Box>
        </MainLayout>
    );
}

export default AIReport;
