import React, { useState } from "react";

// [수정됨] MUI 컴포넌트 임포트
import {
    Paper,
    Box,
    Typography,
    IconButton,
    Tabs,
    Tab,
    Divider
} from "@mui/material";

// [수정됨] MUI 아이콘
import CloseIcon from "@mui/icons-material/Close";

import { getDocIcon } from "../../utils/docUtils";

function StandardSideSheet({ doc, onClose }) {
    // 탭 상태
    const [tabValue, setTabValue] = useState(0);

    if (!doc) {
        return null;
    }

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
                    {/* PDF 아이콘 부분(아이콘은 예시로만) */}
                    <img
                        src={getDocIcon(doc.iconType)}
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
                        {doc.name}
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
                onChange={(event, newValue) => setTabValue(newValue)}
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
                    <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                        {doc.content}
                    </Typography>
                )}
                {tabValue === 1 && (
                    <Box>
                        <Typography variant="body2">
                            여기에 미리보기 이미지를 띄울 수 있습니다.
                        </Typography>
                    </Box>
                )}
            </Box>
        </Paper>
    );
}

export default StandardSideSheet;
