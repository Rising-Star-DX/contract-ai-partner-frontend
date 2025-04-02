import React, { useState, useEffect } from "react";
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
    Alert
} from "@mui/material";

import { useNavigate, useLocation } from "react-router-dom";
import mime from "mime-types";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";

import { useCategory } from "../contexts/CategoryContext";
import { checkCategoryDocs } from "../api/categoryApi";

const FileUploadModal = ({
    open,
    onClose,
    onUpload,
    uploadApi,
    onRequestAnalysis,
    onDeleteFile
}) => {
    const { categories, loading, error } = useCategory();
    const [categoryDocsMap, setCategoryDocsMap] = useState({});
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [uploadingFiles, setUploadingFiles] = useState([]);
    const [alertInfo, setAlertInfo] = useState(null); // MUI Alert 메시지 상태

    const navigate = useNavigate();
    const location = useLocation();

    // 현재 문서 종류
    const docType = location.pathname.startsWith("/agreement")
        ? "AGREEMENT"
        : "STANDARD";

    // 전체 카테고리 삭제
    const slicedCategory = categories.slice(1);

    // ─────────────────────────────────────────────
    // 카테고리 선택 시, 해당 카테고리로 변경
    // ─────────────────────────────────────────────

    const handleCategoryChange = async (e) => {
        const selectedId = e.target.value;
        const foundCat = categories.find((cat) => cat.id === selectedId);

        setSelectedCategory(foundCat || null);
    };

    // ---------------------------------------------
    // 파일 배열에 추가 -> 곧바로 업로드(POST) 진행
    // ---------------------------------------------
    const addFilesAndUpload = async (files) => {
        if (!selectedCategory) {
            setAlertInfo({
                severity: "error",
                message: "카테고리를 먼저 선택해주세요."
            });
            return;
        }

        const newFileItems = files.map((file) => ({
            file,
            fileKey: `${file.name}-${Date.now()}`,
            docId: null,
            progress: 0
        }));

        setUploadingFiles((prev) => [...prev, ...newFileItems]);

        const uploadPromises = newFileItems.map(async (item) => {
            const extension = mime.extension(item.file.type);

            if (!extension) {
                setAlertInfo({
                    severity: "error",
                    message: `지원하지 않는 파일 형식입니다: ${item.file.name}`
                });
                return null;
            }
            try {
                // 업로드 API 호출
                const docId = await uploadApi(
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

                console.log(
                    `docId: ${docId}, selectedCategory.id: ${selectedCategory.id}`
                );

                // 업로드가 완료되어 docId를 받으면, 그때 standardId를 기록
                setUploadingFiles((prev) =>
                    prev.map((f) =>
                        f.fileKey === item.fileKey ? { ...f, docId } : f
                    )
                );

                return docId;
            } catch (err) {
                console.error("파일 업로드 중 오류:", err);
                setAlertInfo({
                    severity: "error",
                    message: "파일 업로드 과정에서 오류가 발생했습니다."
                });
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
    // 파일 개별 삭제
    // ---------------------------------------------
    const handleRemoveFile = async (fileIndex) => {
        const target = uploadingFiles[fileIndex];

        // standardId가 존재하면 서버에도 삭제 요청
        if (target.standardId) {
            try {
                await onDeleteFile(target.standardId);
                console.log(`onDeleteFile ${target.standardId} 삭제 완료`);
            } catch (err) {
                console.warn(`파일 삭제 실패 (ID: ${target.standardId})`, err);
                setAlertInfo({
                    severity: "error",
                    message: "파일 삭제에 실패했습니다."
                });
                return;
            }
        }

        // UI에서 제거
        setUploadingFiles((prev) =>
            prev.filter((_, index) => index !== fileIndex)
        );
    };

    // ---------------------------------------------
    // "추가" 버튼 -> AI 분석 API 호출 (requestAnalysis)
    // ---------------------------------------------
    const handleAnalysis = async () => {
        if (uploadingFiles.length === 0) {
            setAlertInfo({
                severity: "error",
                message: "분석할 파일이 없습니다."
            });
            return;
        }

        // 비동기로 AI 분석 요청 (결과를 기다리지 않음: Fire and Forget)
        uploadingFiles.forEach((item) => {
            console.log(item);

            onRequestAnalysis(item.docId)
                .then(() =>
                    console.log(`AI 분석 완료. standardId: ${item.docId}`)
                )
                .catch((err) => {
                    console.error("AI 분석 요청 중 오류:", err);
                    setAlertInfo({
                        severity: "error",
                        message: "AI 분석 요청 중 오류가 발생했습니다."
                    });
                });
        });

        // 파일 수에 따라 바로 페이지 이동 또는 모달 닫기
        if (uploadingFiles.length === 1) {
            docType === "AGREEMENT"
                ? navigate(`/agreements/${uploadingFiles[0].docId}`)
                : navigate(`/standards/${uploadingFiles[0].docId}`);
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

    // ---------------------------------------------
    // "닫기" 버튼 -> s3 업로드 취소 API 호출 (cancelUploadedDoc)
    // ---------------------------------------------
    const handleCloseWithDelete = async () => {
        const deletableIds = uploadingFiles
            .filter((file) => file.docId) // 업로드된 것만
            .map((file) => file.docId);

        try {
            await Promise.all(
                deletableIds.map((id) =>
                    onDeleteFile(id).catch((err) => {
                        console.warn(`파일 삭제 실패 (id: ${id})`, err);
                    })
                )
            );
        } catch (err) {
            console.error("파일 삭제 중 오류:", err);
        }

        // UI 상태 초기화
        setUploadingFiles([]);
        setSelectedCategory(null);

        // 모달 닫기
        onClose();
    };

    // 카테고리에 기준 문서가 없다면 카테고리 메뉴 비활성화
    useEffect(() => {
        if (docType === "AGREEMENT" && slicedCategory.length > 0) {
            const fetchCategoryDocs = async () => {
                try {
                    const results = await Promise.all(
                        slicedCategory.map(async (cat) => {
                            const hasDocs = await checkCategoryDocs(cat.id);

                            return { [cat.id]: hasDocs };
                        })
                    );
                    // [{1: true}, {2: false}, {3: true}, ...] 를 하나의 객체로 합치기
                    const mergedResult = results.reduce(
                        (acc, curr) => ({ ...acc, ...curr }),
                        {}
                    );

                    setCategoryDocsMap(mergedResult);
                } catch (err) {
                    console.error("카테고리 문서 확인 오류:", err);
                    setAlertInfo({
                        severity: "error",
                        message: "카테고리 문서 확인에 실패했습니다."
                    });
                }
            };

            fetchCategoryDocs();
        }
    }, [docType, slicedCategory]);

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
                        onChange={handleCategoryChange}
                        fullWidth
                        displayEmpty
                        sx={{ mb: 2 }}
                    >
                        <MenuItem value="" disabled>
                            카테고리 선택
                        </MenuItem>
                        {slicedCategory.map((cat) => {
                            const disabledItem =
                                docType === "AGREEMENT" &&
                                categoryDocsMap[cat.id] === false; // 문서가 없으면 true->false

                            return (
                                <MenuItem
                                    key={cat.id}
                                    value={cat.id}
                                    disabled={disabledItem}
                                >
                                    {cat.name}
                                </MenuItem>
                            );
                        })}
                    </Select>
                )}

                {/* 드래그 앤 드롭 영역 */}
                <Box
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    sx={{
                        border: "2px dashed #ccc",
                        padding: 4,
                        py: 30,
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

                {/* MUI Alert를 통한 에러 메시지 출력 */}
                {alertInfo && (
                    <Alert
                        severity={alertInfo.severity}
                        onClose={() => setAlertInfo(null)}
                        sx={{ mb: 2 }}
                    >
                        {alertInfo.message}
                    </Alert>
                )}

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
                    onClick={handleCloseWithDelete}
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
