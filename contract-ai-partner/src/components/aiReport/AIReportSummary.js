import React from "react";
import { Box, Stack, Typography } from "@mui/material";

/**
 * AI 분석 보고서 상단 요약 영역
 * @param {Object} props
 * @param {string} props.docType        - 문서 유형
 * @param {number} props.totalPageNum   - 전체 페이지 수
 * @param {number} props.totalChunkNum  - 전체 문장(Chunk) 수
 * @param {number} props.violationChunkNum - 위반 문장 수
 */
function AIReportSummary({
    docType,
    totalPageNum,
    totalChunkNum,
    violationChunkNum
}) {
    const items = [
        { label: "문서 유형", value: docType },
        { label: "전체 페이지", value: totalPageNum },
        { label: "전체 문장", value: totalChunkNum },
        { label: "위반 건수", value: violationChunkNum }
    ];

    return (
        <Stack
            direction="row"
            spacing={40}
            sx={{ mt: 4, mb: 2, flexWrap: "wrap" }}
        >
            {items.map(({ label, value }) => (
                <Box key={label} sx={{ minWidth: 120 }}>
                    <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                    >
                        {label}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                        {value}
                    </Typography>
                </Box>
            ))}
        </Stack>
    );
}

export default AIReportSummary;
