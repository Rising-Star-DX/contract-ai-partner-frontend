import React from "react";
import {Box, Typography, useTheme} from "@mui/material";

function NavigationMenuItem({icon, label, onClick, active}) {
	const theme = useTheme();

	// 아이콘에 color 스타일을 덮어씌우기
	// (ReactElement인지 확인 후 cloneElement로 수정)
	let iconElement = icon;

	if (React.isValidElement(icon)) {
		iconElement = React.cloneElement(icon, {
			style: {
				color: active ? theme.palette.primary.main : "#ABB2B9",
			},
		});
	}

	return (
		<Box
			onClick={onClick}
			sx={{
				display: "flex",
				alignItems: "center",
				height: 72,
				width: "100%",
				px: 8,
				cursor: "pointer",
				"&:hover": {
					backgroundColor: "#ECECEC",
				},
			}}
		>
			<Box sx={{mr: 5}}>{iconElement}</Box>
			<Typography
				sx={{
					color: active ? theme.palette.primary.main : "#ABB2B9",
					fontWeight: 900,
					fontSize: 18,
				}}
			>
				{label}
			</Typography>
		</Box>
	);
}

export default NavigationMenuItem;
