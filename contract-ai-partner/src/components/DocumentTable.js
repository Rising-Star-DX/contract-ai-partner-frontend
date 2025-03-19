import React from "react";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Checkbox,
    Button,
    IconButton,
    Stack,
    Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

// 파일 아이콘
import DocIcon from "../assets/images/ic_doc.png";
import JpgIcon from "../assets/images/ic_jpg.png";
import PdfIcon from "../assets/images/ic_pdf.png";
import PngIcon from "../assets/images/ic_png.png";
import TxtIcon from "../assets/images/ic_txt.png";
import XlsIcon from "../assets/images/ic_xls.png";

function getFileIcon(iconType) {
    switch (iconType) {
        case "DOC":
            return DocIcon;
        case "JPG":
            return JpgIcon;
        case "PDF":
            return PdfIcon;
        case "PNG":
            return PngIcon;
        case "TXT":
            return TxtIcon;
        case "XLS":
            return XlsIcon;

        default:
            return <DocIcon />;
    }
}

function DocumentTable({ data }) {
    return (
        <Paper sx={{ m: 2 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <Checkbox />
                        </TableCell>
                        <TableCell>문서 이름</TableCell>
                        <TableCell>카테고리</TableCell>
                        <TableCell>업로드 일자</TableCell>
                        <TableCell>업로드 상태</TableCell>
                        <TableCell></TableCell>
                        <TableCell />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>
                                <Checkbox />
                            </TableCell>

                            {/* 문서 아이콘 + 문서 이름 */}
                            <TableCell>
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    spacing={3}
                                >
                                    <img
                                        src={getFileIcon(item.iconType)}
                                        alt="문서 아이콘"
                                        height="32px"
                                        width="32px"
                                    />
                                    <Box>{item.name}</Box>
                                </Stack>
                            </TableCell>

                            {/* 카테고리 */}
                            <TableCell>{item.category}</TableCell>

                            {/* 업로드 일자 */}
                            <TableCell>{item.uploadDate}</TableCell>

                            {/* 업로드 상태 */}
                            <TableCell>{item.status}</TableCell>
                            <TableCell>
                                <Button variant="outlined" size="small">
                                    문서 보기
                                </Button>
                            </TableCell>
                            <TableCell>
                                <IconButton color="error">
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
}

export default DocumentTable;
