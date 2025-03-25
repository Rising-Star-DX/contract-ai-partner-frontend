import React, { useState } from "react";
import { Paper, Box, Grid2, Button } from "@mui/material";
import { pdfjs, Page, Document } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

import { convertS3UrlToHttps } from "../../utils/docUtils";
import ReviewCard from "../contractReview/ReivewCard";

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
                        alignItems: "stretch"
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
                        fontSize: "18px"
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
                    height: "100%",
                    overflow: "hidden"
                }}
            >
                <Box
                    sx={{
                        flex: 1,
                        mb: 4,
                        px: 1,
                        pb: 2,
                        overflowY: "auto",
                        overflowX: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "stretch"
                    }}
                >
                    {agreementData.incorrectTexts.map((data, index) => (
                        <ReviewCard
                            key={data.id}
                            number={index + 1}
                            title={data.incorrectText}
                            page={`${data.currentPage} / `}
                            originalText={data.incorrectText}
                            confidence={data.accuracy}
                            reviewOpinion={data.proofText}
                            suggestion={data.correctedText}
                        />
                    ))}
                </Box>

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
