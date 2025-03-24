import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    Select,
    MenuItem,
    CircularProgress,
    LinearProgress,
    List,
    ListItem,
    ListItemText,
    IconButton
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import mime from "mime-types";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";

import { useCategory } from "../contexts/CategoryContext";
import { uploadStandardDoc, requestAnalysis } from "../api/standardsApi";

// import { checkCategoryDocs } from "../api/categoryApi";

const FileUploadModal = ({ open, onClose, onUpload }) => {
    const { categories, loading, error } = useCategory();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [uploadingFiles, setUploadingFiles] = useState([]);

    const navigate = useNavigate();

    // 전체 카테고리 삭제
    const slicedCategory = categories.slice(1);

    // // 카테고리에 기준 문서 존재 여부
    // const setHasCategoryDocs = useState(false);

    // // ─────────────────────────────────────────────
    // // 카테고리 선택 시, 해당 카테고리 문서 존재 여부 API 호출
    // // ─────────────────────────────────────────────
    // const handleCategoryChange = async (e) => {
    //     const selectedId = e.target.value;
    //     const foundCat = categories.find((cat) => cat.id === selectedId);

    //     setSelectedCategory(foundCat || null);
    //     setHasCategoryDocs(false);

    //     if (!selectedId) {
    //         return;
    //     }

    //     try {
    //         const hasDocs = await checkCategoryDocs(selectedId);

    //         setHasCategoryDocs(hasDocs);

    //         if (!hasDocs) {
    //             console.log("해당 카테고리에 등록된 문서가 없습니다.");
    //         }
    //     } catch (err) {
    //         alert("카테고리 정보를 가져오는 데 실패했습니다.");
    //     }
    // };

    // ---------------------------------------------
    // 파일 배열에 추가 -> 곧바로 업로드(POST) 진행
    // ---------------------------------------------
    const addFilesAndUpload = async (files) => {
        if (!selectedCategory) {
            alert("카테고리를 먼저 선택해주세요.");
            return;
        }

        const newFileItems = files.map((file) => ({
            file,
            fileKey: `${file.name}-${Date.now()}`,
            standardId: null,
            progress: 0
        }));

        setUploadingFiles((prev) => [...prev, ...newFileItems]);

        const uploadPromises = newFileItems.map(async (item, index) => {
            const extension = mime.extension(item.file.type);

            if (!extension) {
                alert(`지원하지 않는 파일 형식입니다: ${item.file.name}`);
                return null;
            }
            try {
                // 업로드 API 호출
                const docId = await uploadStandardDoc(
                    selectedCategory.id,
                    item.file,
                    (progressEvent) => {
                        const progress = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );

                        setUploadingFiles((prev) =>
                            prev.map((f) =>
                                f.fileKey === item.fileKey
                                    ? { ...f, progress }
                                    : f
                            )
                        );
                    }
                );

                console.log(`docId: ${docId}`);

                // 업로드가 완료되어 docId를 받으면, 그때 standardId를 기록
                setUploadingFiles((prev) =>
                    prev.map((f) =>
                        f.fileKey === item.fileKey
                            ? { ...f, standardId: docId }
                            : f
                    )
                );

                return docId;
            } catch (err) {
                console.error("파일 업로드 중 오류:", err);
                alert("파일 업로드 과정에서 오류가 발생했습니다.");
                return null;
            }
        });

        await Promise.all(uploadPromises);
    };

    // ---------------------------------------------
    // 파일 선택 또는 드래그 앤 드롭
    // ---------------------------------------------
    const handleFileChange = async (event) => {
        const input = event.target;
        const files = Array.from(input.files);

        input.value = ""; // 동일 파일 재선택 시에도 이벤트 발생하도록 초기화

        if (files.length > 0) {
            await addFilesAndUpload(files);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = async (event) => {
        event.preventDefault();
        const files = Array.from(event.dataTransfer.files);

        if (files.length > 0) {
            await addFilesAndUpload(files);
        }
    };

    // ---------------------------------------------
    // 파일 개별 삭제 (이미 업로드했다면 서버에도 삭제 요청 필요할 수 있음)
    // ---------------------------------------------
    const handleRemoveFile = (fileIndex) => {
        setUploadingFiles((prev) =>
            prev.filter((_, index) => index !== fileIndex)
        );
    };

    // ---------------------------------------------
    // "추가" 버튼 -> AI 분석 API 호출 (requestAnalysis)
    // ---------------------------------------------
    const handleAnalysis = async () => {
        if (uploadingFiles.length === 0) {
            alert("분석할 파일이 없습니다.");
            return;
        }

        // 비동기로 AI 분석 요청 (결과를 기다리지 않음: Fire and Forget)
        uploadingFiles.forEach((item) => {
            console.log(item);

            requestAnalysis(item.standardId)
                .then(() =>
                    console.log(`AI 분석 완료. standardId: ${item.standardId}`)
                )
                .catch((err) => console.error("AI 분석 요청 중 오류:", err));
        });

        // 파일 수에 따라 바로 페이지 이동 또는 모달 닫기
        if (uploadingFiles.length === 1) {
            navigate(`/standards/${uploadingFiles[0].standardId}`);
        } else {
            onClose();
        }

        if (onUpload) {
            onUpload(
                uploadingFiles.map((f) => f.file),
                selectedCategory
            );
        }

        // 상태 초기화
        setUploadingFiles([]);
        setSelectedCategory(null);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>파일 업로드</DialogTitle>
            <DialogContent>
                {loading && (
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <CircularProgress size={24} />
                    </Box>
                )}
                {!loading && error && (
                    <Typography color="error">{error}</Typography>
                )}

                {!loading && !error && (
                    <Select
                        value={selectedCategory?.id || ""}
                        onChange={(e) => {
                            const selectedId = e.target.value;
                            const foundCat = slicedCategory.find(
                                (cat) => cat.id === selectedId
                            );

                            setSelectedCategory(foundCat || null);
                        }}
                        fullWidth
                        displayEmpty
                        sx={{ mb: 2 }}
                    >
                        <MenuItem value="" disabled>
                            카테고리 선택
                        </MenuItem>
                        {slicedCategory.map((cat) => (
                            <MenuItem key={cat.id} value={cat.id}>
                                {cat.name}
                            </MenuItem>
                        ))}
                    </Select>
                )}

                {/* 드래그 앤 드롭 영역 */}
                <Box
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    sx={{
                        border: "2px dashed #ccc",
                        padding: 4,
                        textAlign: "center",
                        borderRadius: 2,
                        cursor: "pointer",
                        "&:hover": { borderColor: "primary.main" },
                        mb: 2
                    }}
                >
                    <input
                        type="file"
                        multiple
                        style={{ display: "none" }}
                        id="file-input"
                        onChange={handleFileChange}
                    />
                    <label htmlFor="file-input">
                        <CloudUploadIcon fontSize="large" color="primary" />
                        <Typography
                            sx={{
                                color: "primary.main",
                                fontWeight: "bold",
                                mt: 1
                            }}
                        >
                            파일을 여기로 끌어 놓거나 클릭하여 선택
                        </Typography>
                    </label>
                </Box>

                {/* 업로드 목록 & 진행률 표시 */}
                {uploadingFiles.length > 0 && (
                    <List>
                        {uploadingFiles.map((item, index) => (
                            <ListItem
                                key={`${item.file.name}-${index}`}
                                secondaryAction={
                                    <IconButton
                                        edge="end"
                                        onClick={() => handleRemoveFile(index)}
                                        disabled={
                                            item.progress > 0 &&
                                            item.progress < 100
                                        }
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                }
                                sx={{ bgcolor: "#EAECEE", mb: 1 }}
                            >
                                <ListItemText primary={item.file.name} />
                                <LinearProgress
                                    variant="determinate"
                                    value={item.progress}
                                    sx={{ width: "50%", ml: 2 }}
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </DialogContent>

            <DialogActions>
                {/* "추가" 버튼 -> AI 분석 로직 */}
                <Button
                    onClick={handleAnalysis}
                    color="primary"
                    variant="contained"
                    disabled={uploadingFiles.length === 0 || !selectedCategory}
                >
                    추가
                </Button>

                {/* 닫기 버튼 -> 업로드 중에는 비활성 */}
                <Button
                    onClick={onClose}
                    startIcon={<CancelIcon />}
                    disabled={uploadingFiles.some(
                        (f) => f.progress > 0 && f.progress < 100
                    )}
                >
                    닫기
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default FileUploadModal;
