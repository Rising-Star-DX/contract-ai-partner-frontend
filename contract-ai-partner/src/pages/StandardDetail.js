// src/pages/StandardDetail.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";

import MainLayout from "../layouts/MainLayout";

function StandardDetail() {
    const { id } = useParams();
    const [docData, setDocData] = useState(null);

    useEffect(() => {
        // 예: fetch(`/api/standards/${id}`).then(...).then(data => setDocData(data));
        setDocData({
            id,
            name: `기준문서 ${id}`,
            category: "R&D 계약",
            content: "이곳은 기준 문서 상세 내용입니다...",
        });
    }, [id]);

    if (!docData) return <div>Loading...</div>;

    return (
        <MainLayout>
            <Box sx={{ bgcolor: "#fff", p: 4 }}>
                <Typography variant="h4" fontWeight="bold" mb={2}>
                    기준 문서 상세 (ID: {id})
                </Typography>
                <Typography variant="h6">문서명: {docData.name}</Typography>
                <Typography variant="body1">
                    카테고리: {docData.category}
                </Typography>
                <Box sx={{ mt: 2, p: 2, border: "1px solid #ccc" }}>
                    <Typography>내용:</Typography>
                    <Typography>{docData.content}</Typography>
                </Box>
            </Box>
        </MainLayout>
    );
}

export default StandardDetail;
