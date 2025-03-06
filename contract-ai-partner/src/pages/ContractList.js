import React from "react";
import {Box, Typography, Button, Tabs, Tab, IconButton, InputBase} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";

import DocumentTable from "../components/DocumentTable";
import MainLayout from "../layouts/MainLayout";

const dummyData = [
	{
		id: 1,
		iconType: "PDF",
		name: "문서이름 문서이름 문서이름",
		uploadDate: "2024.02.12 03:12 AM",
		status: "업로드 완료",
	}, {
		id: 2,
		iconType: "DOC",
		name: "문서이름 문서이름 문서이름",
		uploadDate: "2024.02.12 03:12 AM",
		status: "업로드 중",
	}, {
		id: 3,
		iconType: "XLS",
		name: "문서이름 문서이름 문서이름",
		uploadDate: "2024.02.12 03:12 AM",
		status: "업로드 실패",
	},
];

function ContractList() {
	const [tabValue, setTabValue] = React.useState(0);

	const handleTabChange = (event, newValue) => {
		setTabValue(newValue);
	};

	return (
		<MainLayout>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					pb: 8,
				}}
			>
				<Typography variant="h4" fontWeight="bold">
					계약 문서 일람
				</Typography>
				<Button variant="contained" color="primary" size="large">
					+ 새 문서
				</Button>
			</Box>

			<Box sx={{borderBottom: 2, borderColor: "divider", mb: 4}}>
				<Tabs value={tabValue} onChange={handleTabChange}>
					<Tab label="전체" />
					<Tab label="R&D 계약" />
					<Tab label="구매 계약" />
					<Tab label="공사 계약" />
					<Tab label="법령" />
				</Tabs>
			</Box>

			<Box sx={{display: "flex", alignItems: "center", p: 2, bgcolor: "#FFFFFF"}}>
				<IconButton>
					<SearchIcon />
				</IconButton>
				<InputBase placeholder="검색어 입력" sx={{ml: 1, flex: 1}} />
				<IconButton>
					<FilterListIcon />
				</IconButton>
			</Box>

			<DocumentTable data={dummyData} />

			<Box sx={{display: "flex", justifyContent: "center", mb: 3}}>
				<Button size="small">1</Button>
				<Button size="small">2</Button>
				<Button size="small">3</Button>
				<Button size="small">4</Button>
				<Button size="small">5</Button>
			</Box>
		</MainLayout>
	);
}

export default ContractList;
