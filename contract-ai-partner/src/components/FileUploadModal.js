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
    IconButton,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";

import mime from "mime-types";

import { useCategory } from "../contexts/CategoryContext"; // Context에서 카테고리 가져오기

const FileUploadModal = ({ open, onClose, onUpload }) => {
    const { categories, loading, error } = useCategory();
    const [selectedCategory, setSelectedCategory] = useState(null); // ✅ 기본값을 빈 오브젝트로 설정
    const [uploadingFiles, setUploadingFiles] = useState([]); // ✅ 업로드 중인 파일 상태

    // ✅ 파일 선택 및 업로드 핸들러 (카테고리 선택 필수)
    const handleFileChange = (event) => {
        console.log("📢 handleFileChange 실행됨!"); // ✅ 함수 실행 여부 확인용 로그

        const input = event.target; // 파일 input 요소
        const files = Array.from(input.files); // ✅ 여러 파일 배열로 변환

        // ✅ 중간에 리턴이 되었어도 동일한 파일을 다시 선택할 수 있도록 input 값 초기화
        input.value = "";

        // 카테고리 정상적으로 선택 되어야 files 추가
        if (!selectedCategory) {
            alert("카테고리를 먼저 선택해주세요.");
            return;
        }

        // 만약 빈 파일이면 files에서 첨부했던 파일 제거
        if (files.length === 0) {
            console.warn("⚠ 선택한 파일이 없습니다.");
            return;
        }

        console.log("📁 파일 선택을 통해 추가된 파일들: ", files);
        files.forEach((file) => {
            console.log(file);

            const extension = mime.extension(file.type);

            if (!extension) {
                alert("지원하지 않는 파일 형식입니다.");
                return;
            }

            const fileObject = {
                name: file.name,
                type: extension.toUpperCase(),
                categoryId: selectedCategory.id,
            };

            console.log(fileObject);

            uploadFile(fileObject);
        });
    };

    // ✅ 드래그 앤 드롭 핸들러 (카테고리 선택 필수)
    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        console.log("📢 handleDrop 실행됨!"); // ✅ 드래그 앤 드롭 함수 실행 여부 확인

        if (!selectedCategory) {
            alert("카테고리를 먼저 선택해주세요.");
            return;
        }

        const files = Array.from(event.dataTransfer.files);

        console.log("📁 드래그 앤 드롭한 파일 목록:", files);
        files.forEach((file) => uploadFile(file));
    };

    // ✅ 파일 삭제 핸들러
    const handleRemoveFile = (fileIndex) => {
        setUploadingFiles((prevFiles) =>
            prevFiles.filter((_, index) => index !== fileIndex),
        );
    };

    // ✅ 파일 업로드 (가짜 진행률)
    const uploadFile = (file) => {
        console.log("📢 업로드 시작 - 파일명:", file.name); // ✅ 업로드 시작 로그

        const newFile = { file, progress: 0 }; // ✅ 개별 파일 진행 상태 추가

        setUploadingFiles((prevFiles) => {
            const updatedFiles = [...prevFiles, newFile];

            console.log("✅ 현재 업로드 중인 파일 목록:", updatedFiles);
            return updatedFiles;
        });

        // ✅ 가짜 업로드 진행률 (실제 API 요청 시 axios `onUploadProgress` 활용)
        const interval = setInterval(() => {
            setUploadingFiles((prevFiles) =>
                prevFiles.map((item) => {
                    if (item.file === file) {
                        const newProgress = Math.min(item.progress + 20, 100);

                        if (newProgress === 100) clearInterval(interval);
                        return { ...item, progress: newProgress };
                    }
                    return item;
                }),
            );
        }, 500);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>파일 업로드</DialogTitle>
            <DialogContent>
                {/* ✅ 카테고리 선택 (로딩, 에러 처리) */}
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
                            const selectedCategoryObject = categories.find(
                                (category) => category.id === selectedId,
                            );

                            setSelectedCategory(selectedCategoryObject || "");
                        }}
                        fullWidth
                        displayEmpty
                        sx={{ mb: 2 }}
                    >
                        <MenuItem value="" disabled>
                            카테고리 선택
                        </MenuItem>
                        {categories.map((categoryObject) => (
                            <MenuItem
                                key={categoryObject.id}
                                value={categoryObject.id}
                            >
                                {categoryObject.name}
                            </MenuItem>
                        ))}
                    </Select>
                )}

                {/* ✅ 드래그 앤 드롭 영역 */}
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
                        mb: 2,
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
                                mt: 1,
                            }}
                        >
                            파일을 여기로 끌어 놓거나 클릭하여 선택
                        </Typography>
                    </label>
                </Box>

                {/* ✅ 파일 목록 및 업로드 진행률 표시 */}
                {uploadingFiles.length > 0 && (
                    <List>
                        {uploadingFiles.map((item, index) => (
                            <ListItem
                                key={index}
                                secondaryAction={
                                    <IconButton
                                        edge="end"
                                        onClick={() => handleRemoveFile(index)}
                                        disabled={item.progress < 100}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                }
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
                <Button
                    onClick={() => {
                        onUpload(
                            uploadingFiles.map((file) => file.file),
                            selectedCategory,
                        );

                        // 모달 창 정보 초기화
                        setSelectedCategory(null);
                        setUploadingFiles([]);
                    }}
                    color="primary"
                    variant="contained"
                    disabled={uploadingFiles.length === 0 || !selectedCategory}
                >
                    추가
                </Button>

                <Button
                    onClick={onClose}
                    startIcon={<CancelIcon />}
                    disabled={uploadingFiles.some(
                        (file) => file.progress < 100,
                    )}
                >
                    닫기
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default FileUploadModal;
