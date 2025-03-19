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
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";

import mime from "mime-types";

import { useCategory } from "../contexts/CategoryContext"; // Context에서 카테고리 가져오기
import { initStandardDoc, uploadStandardFile } from "../api/standardsApi";

const FileUploadModal = ({ open, onClose, onUpload }) => {
    const { categories, loading, error } = useCategory();
    const [selectedCategory, setSelectedCategory] = useState(null); // ✅ 기본값을 빈 오브젝트로 설정
    const [uploadingFiles, setUploadingFiles] = useState([]); // ✅ 업로드 중인 파일 상태

    // ---------------------------------------------
    // 파일을 배열에 추가하면서 "지원하지 않는 형식" 체크
    // ---------------------------------------------
    const addFilesToQueue = async (files) => {
        if (!selectedCategory) {
            alert("카테고리를 먼저 선택해주세요.");
            return;
        }

        const initPromises = [];

        for (let i = 0; i < files.length; i += 1) {
            const file = files[i];
            const extension = mime.extension(file.type);

            if (!extension) {
                alert(`지원하지 않는 파일 형식입니다: ${file.name}`);
                continue;
            }

            const docBody = {
                name: file.name,
                type: extension.toUpperCase(),
                categoryId: selectedCategory.id
            };

            console.log(file, docBody);

            // Init API 호출 (Promise 배열에 저장 -> 동시에 처리)
            const initPromise = initStandardDoc(docBody).then((res) => ({
                file,
                standardId: res.id, // 백엔드에서 생성된 문서 ID
                progress: 0
            }));

            initPromises.push(initPromise);
        }

        // 모든 Init 병렬 처리
        if (initPromises.length > 0) {
            try {
                const results = await Promise.all(initPromises);

                // 기존 업로드 목록에 추가
                setUploadingFiles((prev) => [...prev, ...results]);
            } catch (err) {
                console.error("기준 문서 업로드 init 실패:", err);
                alert("Init 과정에서 오류가 발생했습니다.");
            }
        }
    };

    // ---------------------------------------------
    // 파일 선택
    // ---------------------------------------------
    const handleFileChange = async (event) => {
        const input = event.target;
        const files = Array.from(input.files);

        // 다시 같은 파일을 선택할 수 있게 초기화
        input.value = "";

        if (files.length === 0) {
            console.warn("⚠ 선택한 파일이 없습니다.");
            return;
        }

        // 파일 배열에 추가 + 지원하지 않는 형식 검사
        await addFilesToQueue(files);
    };

    // ---------------------------------------------
    // 드래그 앤 드롭
    // ---------------------------------------------
    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = async (event) => {
        event.preventDefault();
        const files = Array.from(event.dataTransfer.files);

        if (files.length === 0) {
            console.warn("⚠ 드래그 앤 드롭한 파일이 없습니다.");
            return;
        }

        await addFilesToQueue(files);
    };

    // ---------------------------------------------
    // 파일 개별 삭제
    // ---------------------------------------------
    const handleRemoveFile = (fileIndex) => {
        setUploadingFiles((prev) =>
            prev.filter((_, index) => index !== fileIndex)
        );
    };

    // ---------------------------------------------
    // "추가" 버튼 클릭 -> 이미 Init 완료된 문서에
    //  실제 파일(PATCH) 업로드
    // ---------------------------------------------
    const handleUploadAll = async () => {
        if (uploadingFiles.length === 0) {
            alert("업로드할 파일이 없습니다.");
            return;
        }

        try {
            // PATCH 병렬 호출
            const patchPromises = uploadingFiles.map((item, idx) =>
                uploadStandardFile(
                    item.standardId,
                    item.file,
                    (progressEvent) => {
                        const progress = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );

                        setUploadingFiles((prev) =>
                            prev.map((f, fIdx) => {
                                if (fIdx === idx) {
                                    return { ...f, progress };
                                }
                                return f;
                            })
                        );
                    }
                )
            );

            await Promise.all(patchPromises);

            // 업로드 완료 후 처리
            if (uploadingFiles.length === 1) {
                // 파일이 1개면 상세화면 이동 등
                console.log("단일 파일 업로드 완료 -> 상세화면 이동 로직");
                // navigate(`/standards/detail/${uploadingFiles[0].standardId}`);
            } else {
                // 여러 개면 모달 닫기
                onClose();
            }

            // 업로드 완료한 파일 정보 전달
            if (onUpload) {
                onUpload(
                    uploadingFiles.map((f) => f.file),
                    selectedCategory
                );
            }

            // 초기화
            setUploadingFiles([]);
            setSelectedCategory(null);
        } catch (err) {
            console.error("업로드 중 오류 발생:", err);
            alert("업로드 중 오류가 발생했습니다.");
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>파일 업로드</DialogTitle>
            <DialogContent>
                {/* 카테고리 로딩 및 에러 상태 */}
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
                            const foundCat = categories.find(
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
                        {categories.map((cat) => (
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
                                key={index}
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
                {/* "추가" 버튼 -> 실제 업로드 로직 */}
                <Button
                    onClick={handleUploadAll}
                    color="primary"
                    variant="contained"
                    disabled={uploadingFiles.length === 0 || !selectedCategory}
                >
                    추가
                </Button>

                {/* 닫기 버튼 -> 업로드 중일 때는 비활성 */}
                <Button
                    onClick={onClose}
                    startIcon={<CancelIcon />}
                    disabled={uploadingFiles.some(
                        (file) => file.progress > 0 && file.progress < 100
                    )}
                >
                    닫기
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default FileUploadModal;
