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
                <Box
                    sx={{
                        flex: 1,
                        mb: 4,
                        overflow: "auto",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center"
                    }}
                >
                    <ReviewCard
                        number={1}
                        title="죽는 날까지 하늘을 우러러 한 점..."
                        page="212/715"
                        originalText={`죽는 날까지 하늘을 우러러 한 점 부끄럼이 없기를, 잎새에 이는 바람에도 나는 괴로워했다.\n별을 노래하는 마음으로 모든 죽어 가는 것을 사랑해야지 그리고 나한테 주어진 길을 걸어가야겠다.\n오늘 밤에도 별이 바람에 스치운다.`}
                        confidence={98.7}
                        reviewOpinion={`원 사업자가 입찰 내역에 없는 사항을 요구함에 따라 발생된 비용을 수급사 사업자에게 부담시키는 약정임`}
                        suggestion={`투찰 시 “원 사업자”의 적산 기준서를 숙지하여 투찰에 임하도록 한다.`}
                    />
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
