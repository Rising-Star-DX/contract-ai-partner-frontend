// src/components/contractReview/ReviewContent.jsx
import React from "react";
import { Paper, Typography, Box, Grid2, Button } from "@mui/material";

function ReviewContent() {
    return (
        <Grid2 container spacing={2} sx={{ p: 2, flexGrow: 1 }}>
            {/* 왼쪽: 원본 */}
            <Grid2 item xs={12} md={6}>
                <Paper sx={{ height: "70vh", p: 2, overflow: "auto" }}>
                    <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                        원본 문서
                    </Typography>
                    <Box sx={{ whiteSpace: "pre-wrap" }}>
                        {/* 실제 계약서 원본 텍스트 or 뷰어 */}
                        Lorem ipsum dolor sit amet, consectetur adipiscing
                        elit...
                    </Box>
                </Paper>
                <Button variant="contained" color="primary">
                    수동 문구 추출
                </Button>
            </Grid2>

            {/* 오른쪽: 검토 결과 */}
            <Grid2 item xs={12} md={6}>
                <Paper sx={{ height: "70vh", p: 2, overflow: "auto" }}>
                    <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                        검토 결과
                    </Typography>
                    <Box sx={{ whiteSpace: "pre-wrap" }}>
                        {/* AI 분석 결과나 수정 권장사항, 하이라이트된 문구 등 */}
                        [주의] 1조 계약 내용에 누락 사항이 발견되었습니다...
                    </Box>
                </Paper>
                <Button variant="contained" color="secondary">
                    AI 분석 보고서 확인
                </Button>
            </Grid2>
        </Grid2>
    );
}

export default ReviewContent;
