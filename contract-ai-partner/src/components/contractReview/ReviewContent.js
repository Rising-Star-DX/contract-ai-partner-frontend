import React, { useState, useEffect, useRef } from "react";
import { Paper, Box, Grid2, Button, useTheme, Typography } from "@mui/material";

import { Worker, Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

import { highlightPlugin, Trigger } from "@react-pdf-viewer/highlight";
import "@react-pdf-viewer/highlight/lib/styles/index.css";

import { useNavigate } from "react-router-dom";

import BeatLoader from "react-spinners/BeatLoader";
import ReviewCard from "../contractReview/ReivewCard";
import AIFailImage from "../../assets/images/img_fail.png";

function ReviewContent({ agreementData }) {
    const [highlightAreas, setHighlightAreas] = useState([]);

    // 카드 관련
    const [openCardId, setOpenCardId] = useState(null);
    const cardRefs = useRef({});
    const scrollableContainerRef = useRef(null);

    // 테마
    const theme = useTheme();

    // 네비게이션
    const navigation = useNavigate();

    const highlightPluginInstance = highlightPlugin({
        highlightAreas,
        trigger: Trigger.None,
        renderHighlights: ({ pageIndex, rotation }) => {
            // 현재 페이지(pageIndex)에 해당하는 영역만 필터링
            const areasOnPage = highlightAreas.filter(
                (a) => a.pageIndex === pageIndex
            );

            return (
                <>
                    {areasOnPage.map((area, idx) => {
                        const {
                            top,
                            left,
                            width,
                            height,
                            data: { id },
                            styleType,
                            isClickable
                        } = area; // 구조분해로 shadow 방지

                        const baseStyle = {
                            position: "absolute",
                            top: `${top}%`,
                            left: `${left}%`,
                            width: `${width}%`,
                            height: `${height}%`,
                            rotate: rotation,
                            cursor: "pointer",
                            pointerEvents: isClickable ? "auto" : "none",
                            zIndex: 1
                        };

                        const style =
                            styleType === "underline"
                                ? {
                                      ...baseStyle,
                                      borderBottom:
                                          "2px solid rgba(255,0,0,0.9)",
                                      backgroundColor: "transparent"
                                  }
                                : {
                                      ...baseStyle,
                                      backgroundColor: "rgba(255,255,0,0.3)" // 노란 형광
                                  };

                        return (
                            <div
                                key={idx}
                                id={id}
                                style={style}
                                onClick={() =>
                                    isClickable ? setOpenCardId(id) : null
                                }
                            />
                        );
                    })}
                </>
            );
        }
    });

    // PDF / 이미지 표시 부분
    const renderOriginal = () => {
        if (!agreementData) return null;

        const isPdf = agreementData.type?.toUpperCase() === "PDF" || agreementData.type?.toUpperCase() === "DOCX" || agreementData.type?.toUpperCase() === "DOC" || agreementData.type?.toUpperCase() === "XLSX";

        if (isPdf) {
            /* 기존 PDF 렌더러 그대로 */
            return (
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
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                        <Viewer
                            fileUrl={agreementData.url}
                            plugins={[highlightPluginInstance]}
                            defaultScale={SpecialZoomLevel.PageWidth}
                        />
                    </Worker>
                </Paper>
            );
        } else {
            return (
                <Paper
                    sx={{
                        flex: 1,
                        mb: 4,
                        overflow: "auto"
                    }}
                >
                    <Box sx={{ position: "relative", width: "100%" }}>
                        {/* 단일 이미지 (pageIndex = 0) */}
                        <img
                            src={agreementData.url}
                            alt="agreement"
                            style={{ width: "100%", display: "block" }}
                        />

                        {/* 오버레이 */}
                        {highlightAreas
                            .filter((a) => a.pageIndex === 0)
                            .map((area, index) => {
                                const {
                                    top,
                                    left,
                                    width,
                                    height,
                                    data: { id },
                                    styleType,
                                    isClickable
                                } = area;

                                const baseStyle = {
                                    position: "absolute",
                                    top: `${top}%`,
                                    left: `${left}%`,
                                    width: `${width}%`,
                                    height: `${height}%`,
                                    cursor: isClickable ? "pointer" : "default",
                                    pointerEvents: isClickable
                                        ? "auto"
                                        : "none",
                                    zIndex: 1
                                };

                                const style =
                                    styleType === "underline"
                                        ? {
                                              ...baseStyle,
                                              borderBottom:
                                                  "2px solid rgba(255,0,0,0.9)",
                                              backgroundColor: "transparent"
                                          }
                                        : {
                                              ...baseStyle,
                                              backgroundColor:
                                                  "rgba(255,255,0,0.3)"
                                          };

                                return (
                                    <Box
                                        key={id + index}
                                        id={id}
                                        sx={style}
                                        onClick={() =>
                                            isClickable
                                                ? setOpenCardId(id)
                                                : undefined
                                        }
                                    />
                                );
                            })}
                    </Box>
                </Paper>
            );
        }
    };

    const handleAccordionEntered = (cardId) => {
        scrollToCard(cardId);
    };

    const scrollToCard = (id) => {
        // 찾고자 하는 Card DOM
        const cardElement = cardRefs.current[id];
        // 스크롤 컨테이너
        const container = scrollableContainerRef.current;

        if (!cardElement || !container) return;

        const rect = cardElement.getBoundingClientRect();
        // 컨테이너의 현재 스크롤 위치와 사각 정보를 합산
        const containerRect = container.getBoundingClientRect();
        const offset = 2; // 예: 헤더/마진 고려한 오프셋

        // 스크롤 위치 = (현재 컨테이너 스크롤) + (카드의 top - 컨테이너의 top) - offset
        const scrollTop =
            container.scrollTop + (rect.top - containerRect.top) - offset;

        container.scrollTo({
            top: scrollTop,
            behavior: "smooth"
        });
    };

    // 카드 표시용 중복 제거 배열
    const uniqueIncorrectTexts = agreementData.incorrectTexts.filter(
        (item, index, self) =>
            self.findIndex((t) => t.incorrectText === item.incorrectText) ===
            index
    );

    // 데이터 표시/로딩/실패 결과 표시
    const aIResult = (aIData) => {
        if (!aIData) {
            return (
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column"
                    }}
                >
                    <Typography sx={{ fontFamily: "NanumSquareNeoHeavy" }}>
                        데이터를 받아오는 데 실패했습니다.
                    </Typography>
                </Box>
            );
        }

        if (aIData.status === "SUCCESS") {
            return (
                <Box
                    ref={scrollableContainerRef}
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
                    {uniqueIncorrectTexts.map((data, index) => (
                        <ReviewCard
                            key={data.id}
                            ref={(el) => {
                                cardRefs.current[data.id] = el;
                            }}
                            number={index + 1}
                            title={data.incorrectText}
                            page={`${data.currentPage} / ${aIData.totalPage}`}
                            originalText={data.incorrectText}
                            confidence={data.accuracy}
                            reviewOpinion={data.proofText}
                            suggestion={data.correctedText}
                            isOpen={openCardId === data.id}
                            onChange={(_, expanded) => {
                                setOpenCardId(expanded ? data.id : null);
                            }}
                            onEntered={() => handleAccordionEntered(data.id)}
                        />
                    ))}
                </Box>
            );
        } else if (aIData.status === "AI-FAILED") {
            return (
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        mb: 20
                    }}
                >
                    <img src={AIFailImage} height="300px" />
                    <Typography
                        sx={{
                            fontFamily: "NanumSquareNeoHeavy",
                            color: theme.palette.primary.main,
                            fontSize: 24,
                            mt: 4,
                            mb: 4
                        }}
                    >
                        AI 분석 실패
                    </Typography>
                </Box>
            );
        } else {
            return (
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        mb: 12
                    }}
                >
                    <Typography
                        sx={{
                            fontFamily: "NanumSquareNeoHeavy",
                            color: theme.palette.primary.main,
                            fontSize: 30,
                            mb: 4
                        }}
                    >
                        AI 분석 중
                    </Typography>
                    <BeatLoader color={theme.palette.primary.main} size={20} />
                </Box>
            );
        }
    };

    useEffect(() => {
        if (!agreementData?.incorrectTexts) {
            return;
        }

        const isPdf = agreementData.type?.toUpperCase() === "PDF";
        const calcPageIndex = (origPage) => (isPdf ? origPage - 1 : 0);

        const underlineAreas = agreementData.incorrectTexts.flatMap((item) =>
            item.positions.map((p) => ({
                ...p,
                pageIndex: calcPageIndex(item.currentPage),
                data: { id: item.id },
                styleType: "underline", // 구분자
                isClickable: true
            }))
        );

        const highlightParts = agreementData.incorrectTexts.flatMap((item) =>
            item.positionParts.map((p) => ({
                ...p,
                pageIndex: calcPageIndex(item.currentPage),
                data: { id: item.id },
                styleType: "highlight", // 구분자
                isClickable: false
            }))
        );

        setHighlightAreas([...underlineAreas, ...highlightParts]);
    }, [agreementData]);

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
                {/* PDF / 이미지 따라서 컴포넌트 변경 */}
                {renderOriginal()}
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
                {aIResult(agreementData)}
                <Button
                    onClick={() => {
                        navigation(`/agreements/analysis/${agreementData.id}`);
                    }}
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
