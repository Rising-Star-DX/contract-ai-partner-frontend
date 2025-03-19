// src/components/UserProfile.jsx
import React from "react";
import {Box, Avatar, Typography, Stack} from "@mui/material";

function UserProfile({
	avatarUrl = "",
	userName = "POSCO DX",
	userTeam = "R&D 1팀",
	userEmail = "sample123@poscodx.com",
}) {
	return (
		<Box sx={{width: "100%", height: 120, px: 5, bgcolor: "#EAECEE"}} alignContent="center">
			<Stack direction="row" alignItems="center" spacing={4}>
				{/* 아바타 이미지 */}
				<Avatar src={avatarUrl} alt={userName} sx={{width: 64, height: 64}} />

				{/* 텍스트 영역 */}
				<Box sx={{width: "100%"}}>
					<Typography sx={{fontSize: 20, fontWeight: 900}}>{userName}</Typography>
					<Typography sx={{fontSize: 14}} color="text.secondary">
						{userTeam}
					</Typography>
					<Typography sx={{fontSize: 12}} color="text.secondary">
						{userEmail}
					</Typography>
				</Box>
			</Stack>
		</Box>
	);
}

export default UserProfile;
