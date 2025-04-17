import React from "react";
import { Button, Typography, Grid2 } from "@mui/material";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";

function AIReportHeader({ category, docName, onDownload }) {
    return (
        <Grid2
            container
            direction="row"
            spacing={4}
            sx={{ alignItems: "flex-end", mb: 4 }}
        >
            {/* 제목 + 경로 */}
            <Grid2>
                <Typography variant="h4" fontWeight="bold">
                    AI 분석 보고서
                </Typography>
            </Grid2>

            <Grid2>
                <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ color: "text.secondary" }}
                >
                    {category} &gt; {docName}
                </Typography>
            </Grid2>

            {/* 오른쪽 정렬용 flex 아이템 */}
            <Grid2 sx={{ ml: "auto" }}>
                <Button
                    variant="contained"
                    startIcon={<DownloadOutlinedIcon />}
                    onClick={onDownload}
                >
                    Excel 다운로드
                </Button>
            </Grid2>
        </Grid2>
    );
}

export default AIReportHeader;
