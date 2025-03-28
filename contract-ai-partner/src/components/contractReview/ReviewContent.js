import React, { useState, useEffect, useRef } from "react";
import { Paper, Box, Grid2, Button } from "@mui/material";

import { Worker, Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

import { highlightPlugin, Trigger } from "@react-pdf-viewer/highlight";
import "@react-pdf-viewer/highlight/lib/styles/index.css";

import ReviewCard from "../contractReview/ReivewCard";

function ReviewContent({ agreementData }) {
    const [highlightAreas, setHighlightAreas] = useState([]);

    // 카드 관련
    const [openCardId, setOpenCardId] = useState(null);
    const cardRefs = useRef({});
    const scrollableContainerRef = useRef(null);

    const highlightPluginInstance = highlightPlugin({
        highlightAreas,
        trigger: Trigger.None,
        renderHighlights: (props) => {
            const { pageIndex, rotation } = props;

            // 현재 페이지(pageIndex)에 해당하는 영역만 필터링
            const areas = highlightAreas.filter(
                (area) => area.pageIndex === pageIndex
            );

            return (
                <>
                    {areas.map((area, index) => {
                        const { top, left, width, height } = area;
                        const id = area.data.id;

                        return (
                            <div
                                key={index}
                                id={id}
                                style={{
                                    position: "absolute",
                                    top: `${top}%`,
                                    left: `${left}%`,
                                    width: `${width}%`,
                                    height: `${height}%`,
                                    backgroundColor: "yellow",
                                    opacity: 0.3,
                                    cursor: "pointer",
                                    rotate: rotation,
                                    pointerEvents: "auto",
                                    zIndex: 1
                                }}
                                onClick={() => {
                                    console.log("id: ", id);

                                    setOpenCardId(id);
                                }}
                            />
                        );
                    })}
                </>
            );
        }
    });

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

    useEffect(() => {
        if (!agreementData?.incorrectTexts) {
            return;
        }

        const converted = agreementData.incorrectTexts.flatMap((item) => {
            const pageIndex = item.currentPage - 1; // 0-based

            return item.positions.map((pos) => ({
                pageIndex,
                top: pos.top,
                left: pos.left,
                width: pos.width,
                height: pos.height,
                data: {
                    id: item.id
                }
            }));
        });

        setHighlightAreas(converted);
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
                    {agreementData.incorrectTexts.map((data, index) => (
                        <ReviewCard
                            key={data.id}
                            ref={(el) => {
                                cardRefs.current[data.id] = el;
                            }}
                            number={index + 1}
                            title={data.incorrectText}
                            page={`${data.currentPage} / ${agreementData.totalPage}`}
                            originalText={data.incorrectText}
                            confidence={data.accuracy}
                            reviewOpinion={data.proofText}
                            suggestion={data.correctedText}
                            isOpen={openCardId === data.id}
                            onChange={(_, expanded) => {
                                if (expanded) {
                                    // 열릴 경우
                                    setOpenCardId(data.id);
                                } else {
                                    // 닫힐 경우
                                    setOpenCardId(null);
                                }
                            }}
                            onEntered={() => handleAccordionEntered(data.id)}
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
