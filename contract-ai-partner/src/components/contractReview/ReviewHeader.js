// src/components/contractReview/ReviewHeader.jsx
import React from "react";
import {Grid2, Typography} from "@mui/material";

function ReviewHeader({category, docName, docType}) {
	return (
		<Grid2
			container
			direction="row"
			spacing={4}
			sx={{
				justifyContent: "flex-start",
				alignItems: "flex-end",
				mb: 4,
			}}
		>
			<Grid2>
				<Typography variant="h4" fontWeight="bold">
					계약 문서 검토
				</Typography>
			</Grid2>
			<Grid2>
				<Typography variant="h6" fontWeight="bold" sx={{color: "text.secondary"}}>
					{/* "카테고리 > 문서이름.문서타입" 형태로 표시 */}
					{category} &gt; {docName}.{docType}
				</Typography>
			</Grid2>
		</Grid2>
	);
}

export default ReviewHeader;
