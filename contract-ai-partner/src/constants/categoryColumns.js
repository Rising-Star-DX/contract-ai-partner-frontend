import { IconButton } from "@mui/material";

import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";

const CATEGORY_COLUMNS = (onRowView, onRowDelete) => [
    {
        field: "name",
        headerName: "카테고리 이름",
        flex: 1.5
    },
    {
        field: "countOfStandards",
        headerName: "기준 문서 건수",
        flex: 1,
        headerAlign: "center",
        align: "center"
    },
    {
        field: "countOfAgreements",
        headerName: "계약 문서 건수",
        flex: 1,
        headerAlign: "center",
        align: "center"
    },
    {
        field: "createdAt",
        headerName: "등록일",
        type: "dateTime",
        flex: 1,
        headerAlign: "center",
        align: "center",
        valueGetter: (params) => new Date(params)
    },
    {
        field: "edit",
        headerName: "",
        sortable: false,
        headerAlign: "center",
        align: "center",
        renderCell: (params) => (
            <IconButton onClick={() => {}}>
                <ModeEditOutlinedIcon />
            </IconButton>
        )
    },
    {
        field: "delete",
        headerName: "",
        sortable: false,
        headerAlign: "center",
        align: "center",
        renderCell: (params) => (
            <IconButton color="error" onClick={() => {}}>
                <ClearOutlinedIcon />
            </IconButton>
        )
    }
];

export default CATEGORY_COLUMNS;
