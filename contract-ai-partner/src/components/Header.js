import React from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Box,
    Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";

function Header() {
    return (
        <AppBar
            position="static"
            sx={{ color: "#000", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
            <Toolbar sx={{ justifyContent: "space-between" }}>
                {/* 왼쪽 영역: 로고 또는 메뉴 버튼 */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton edge="start" color="inherit" sx={{ mr: 1 }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div">
                        계약 문서 시스템
                    </Typography>
                </Box>

                {/* 오른쪽 영역: 알림, 사용자 정보 등 */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton color="inherit" sx={{ mr: 2 }}>
                        <NotificationsIcon />
                    </IconButton>
                    <Avatar
                        sx={{ width: 32, height: 32 }}
                        // src={UserAvatar}
                        alt="User Avatar"
                    />
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
