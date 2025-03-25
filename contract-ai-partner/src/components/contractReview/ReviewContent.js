import React, { useState } from "react";
import { Paper, Typography, Box, Grid2, Button } from "@mui/material";
import { pdfjs, Page, Document } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

import { convertS3UrlToHttps } from "../../utils/docUtils";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
).toString();

function ReviewContent({ agreementData }) {
    const [numPages, setNumPages] = useState(null);

    const onDocumentLoadSuccess = ({ nPages }) => {
        setNumPages(nPages);
    };

    return (
        <Grid2
            container
            spacing={4}
            sx={{ flexGrow: 1, height: "80vh", pt: 4 }}
        >
            {/* 왼쪽: 원본 */}
            <Grid2
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    height: "100%"
                }}
            >
                <Paper
                    id="pdf-container"
                    sx={{
                        flex: 1,
                        mb: 4,
                        overflow: "auto",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center"
                    }}
                >
                    <Document
                        file={convertS3UrlToHttps(agreementData.url)}
                        onLoadSuccess={onDocumentLoadSuccess}
                    >
                        {Array.from(new Array(numPages), (el, index) => (
                            <Box
                                key={`page_${index + 1}`}
                                sx={{
                                    width: "100%",
                                    mb: 2,
                                    "& canvas": {
                                        width: "100% !important",
                                        height: "auto !important"
                                    }
                                }}
                            >
                                <Page
                                    pageNumber={index + 1}
                                    width={
                                        document.getElementById("pdf-container")
                                            ?.clientWidth || undefined
                                    }
                                />
                            </Box>
                        ))}
                    </Document>
                </Paper>
                <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    sx={{
                        mb: 10,
                        bgcolor: "#FFFFFF",
                        fontWeight: "bold",
                        fontSize: "18px",
                        color: "#17202A"
                    }}
                >
                    수동 문구 추가
                </Button>
            </Grid2>

            {/* 오른쪽: 검토 결과 */}
            <Grid2
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    height: "100%"
                }}
            >
                <Paper
                    sx={{
                        flex: 1,
                        p: 2,
                        mb: 4,
                        overflow: "auto",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center"
                    }}
                >
                    <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                        검토 결과
                    </Typography>
                    <Box sx={{ whiteSpace: "pre-wrap" }}>
                        {/* AI 분석 결과나 수정 권장사항, 하이라이트된 문구 등 */}
                        [주의] 1조 계약 내용에 누락 사항이 발견되었습니다...
                    </Box>
                </Paper>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{
                        mb: 10,
                        fontWeight: "bold",
                        fontSize: "18px"
                    }}
                >
                    AI 분석 보고서 확인
                </Button>
            </Grid2>
        </Grid2>
    );
}

export default ReviewContent;
