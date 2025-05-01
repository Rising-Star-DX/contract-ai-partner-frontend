// src/components/UserProfile.jsx
import React, {useContext} from "react";
import { Box, Avatar, Typography, Stack } from "@mui/material";

import RoleContext from "../contexts/RoleContext";

function UserProfile({
    avatarUrl = "",
    userName = "POSCO DX",
    userTeam = "R&D 2팀",
    userEmail = "rising-star@poscodx.com",
}) {
    // 1) Context에서 role과 setRole 가져오기
    const { role, setRole } = useContext(RoleContext);

    // 2) 클릭 핸들러: admin<->user 토글
    const handleAvatarClick = () => {
        console.log("avatar click");
        

        if (role === "admin") {
            setRole("user");
        } else {
        setRole("admin");
        }
    };

    return (
        <Box
            sx={{ width: "100%", height: 120, px: 5, bgcolor: "#EAECEE" }}
            alignContent="center"
        >
            <Stack direction="row" alignItems="center" spacing={4}>
                {/* 아바타 이미지 */}
                <Avatar
                    src={avatarUrl}
                    alt={userName}
                    sx={{ width: 64, height: 64 }}
                    onClick={handleAvatarClick}
                />

                {/* 텍스트 영역 */}
                <Box sx={{ width: "100%" }}>
                    <Typography sx={{ fontSize: 20, fontWeight: 900 }}>
                        {userName}
                    </Typography>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary">
                        {userTeam}
                    </Typography>
                    <Typography sx={{ fontSize: 12 }} color="text.secondary">
                        {userEmail}
                    </Typography>
                </Box>
            </Stack>
        </Box>
    );
}

export default UserProfile;
