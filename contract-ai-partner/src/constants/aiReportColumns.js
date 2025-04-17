import { Chip } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";

// ───────────────────────────────────────────────────────────
// 신뢰도 값을 예쁜 Chip 으로 변환
// ───────────────────────────────────────────────────────────
function renderAccuracyChip(value) {
    let label = "낮음";
    let color = "error"; // MUI preset 색상

    if (value >= 95) {
        label = "매우 높음";
        color = "primary";
    } else if (value >= 90) {
        label = "높음";
        color = "success";
    } else if (value >= 80) {
        label = "보통";
        color = "warning";
    }

    return (
        <Chip
            icon={<CircleIcon fontSize="small" />}
            label={`${label} (${value.toFixed(1)}%)`}
            size="small"
            color={color}
            variant="outlined"
        />
    );
}

// ───────────────────────────────────────────────────────────
// DataGrid 컬럼 정의 (no-shadow, no-nested-ternary 준수)
// ───────────────────────────────────────────────────────────
const AI_REPORT_COLUMNS = [
    {
        field: "id",
        headerName: "검출 ID",
        width: 100,
        headerAlign: "center",
        align: "center"
    },
    {
        field: "currentPage",
        headerName: "페이지",
        width: 90,
        headerAlign: "center",
        align: "center",
        type: "number"
    },
    {
        field: "incorrectText",
        headerName: "검출 문장",
        flex: 2,
        minWidth: 300
    },
    {
        field: "accuracy",
        headerName: "신뢰도",
        width: 160,
        headerAlign: "center",
        align: "center",
        renderCell: (params) => renderAccuracyChip(params.value),
        sortComparator: (v1, v2) => v1 - v2
    },
    {
        field: "proofText",
        headerName: "검토 의견",
        flex: 2,
        minWidth: 280
    },
    {
        field: "correctedText",
        headerName: "추천 문장",
        flex: 2,
        minWidth: 280
    }
];

export default AI_REPORT_COLUMNS;
