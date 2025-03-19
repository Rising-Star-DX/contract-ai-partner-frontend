// src/components/DocumentListPage.js
import React, { useState } from "react";
import {
    Box,
    Typography,
    Button,
    Tabs,
    Tab,
    IconButton,
    InputBase,
    CircularProgress,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";

import MainLayout from "../layouts/MainLayout";

function DocumentListPage({
    title, // 페이지 상단 제목: ex) "계약 문서 일람", "기준 문서 일람"
    rows, // DataGrid에 넣을 row 데이터
    columns, // DataGrid 컬럼 정의
    tabs = [], // 탭 라벨 배열
    showNewButton, // role이 admin이면 true
    onNewDocClick, // + 새 문서 버튼 클릭 핸들러
    onRowView, // 문서 보기 클릭 핸들러
    onRowDelete, // 문서 삭제 클릭 핸들러
    loading,
    tabValue,
    onTabChange,
    error,
}) {
    const [searchTerm, setSearchTerm] = useState("");

    const renderContent = () => {
        if (loading) {
            return (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                    }}
                >
                    <CircularProgress />
                </Box>
            );
        }

        if (error) {
            return (
                <Box sx={{ p: 2 }}>
                    <Typography color="error">{error}</Typography>
                </Box>
            );
        }

        if (!loading && !error && rows.length === 0) {
            return (
                <Box sx={{ p: 2 }}>
                    <Typography color="textSecondary">
                        해당 카테고리에 문서가 없습니다.
                    </Typography>
                </Box>
            );
        }

        return (
            <DataGrid
                rows={rows}
                columns={columns(onRowView, onRowDelete)}
                pageSize={5}
                rowsPerPageOptions={[5, 10, 20]}
                checkboxSelection
                disableSelectionOnClick
                disableColumnMenu
                rowHeight={56}
                headerHeight={60}
                sx={{
                    minHeight: "100%",
                    "& .MuiDataGrid-columnHeader": {
                        backgroundColor: "#E5E7E9",
                    },
                    "& .MuiDataGrid-columnHeaderTitle": {
                        fontSize: "20px",
                        fontWeight: 900,
                    },
                    "& .MuiDataGrid-cell": {
                        backgroundColor: "#FFFFFF",
                        fontSize: "16px",
                        fontWeight: 400,
                    },
                }}
            />
        );
    };

    return (
        <MainLayout>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    overflow: "hidden",
                }}
            >
                {/* 제목 & 새 문서 버튼 */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        pb: 2,
                    }}
                >
                    <Typography variant="h4" fontWeight="bold">
                        {title}
                    </Typography>
                    {showNewButton && (
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={onNewDocClick}
                        >
                            + 새 문서
                        </Button>
                    )}
                </Box>

                {/* 카테고리 탭 */}
                {tabs.length > 0 && (
                    <Box
                        sx={{ borderBottom: 2, borderColor: "divider", mb: 2 }}
                    >
                        <Tabs value={tabValue} onChange={onTabChange}>
                            {tabs.map((tab) => (
                                <Tab key={tab.id} label={tab.name} />
                            ))}
                        </Tabs>
                    </Box>
                )}

                {/* 검색 입력 */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        p: 2,
                        bgcolor: "#FFFFFF",
                        mb: 2,
                    }}
                >
                    <IconButton>
                        <SearchIcon />
                    </IconButton>
                    <InputBase
                        placeholder="검색어 입력"
                        sx={{ ml: 1, flex: 1 }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Box>

                {/* 문서 리스트 영역 */}
                <Box sx={{ flexGrow: 1, overflow: "auto", bgcolor: "#FFFFFF" }}>
                    {renderContent()}
                </Box>
            </Box>
        </MainLayout>
    );
}

export default DocumentListPage;
