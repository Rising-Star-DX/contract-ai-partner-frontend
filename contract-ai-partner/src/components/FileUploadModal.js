import React, {useState} from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Typography,
	LinearProgress,
	Box,
} from "@mui/material";
import {CloudUpload, Cancel} from "@mui/icons-material";

const FileUploadModal = ({open, onClose, onUpload}) => {
	const [selectedFile, setSelectedFile] = useState(null);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [uploading, setUploading] = useState(false);

	const handleFileChange = event => {
		const file = event.target.files[0];

		if (file) {
			setSelectedFile(file);
		}
	};

	const handleUpload = async () => {
		if (!selectedFile) return;

		setUploading(true);
		setUploadProgress(0);

		// 업로드 API 연동 (가짜 진행 상태 시뮬레이션)
		const interval = setInterval(() => {
			setUploadProgress(prev => {
				if (prev >= 100) {
					clearInterval(interval);
					setUploading(false);
					onUpload(selectedFile); // 업로드 완료 시 콜백 실행
					return 100;
				}
				return prev + 20;
			});
		}, 500);
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle>파일 업로드</DialogTitle>
			<DialogContent>
				<Box
					sx={{
						border: "2px dashed #ccc",
						padding: 4,
						textAlign: "center",
						cursor: "pointer",
						borderRadius: 2,
						"&:hover": {borderColor: "primary.main"},
					}}
				>
					<input type="file" style={{display: "none"}} id="file-input" onChange={handleFileChange} />
					<label htmlFor="file-input">
						<CloudUpload fontSize="large" color="primary" />
						<Typography sx={{color: "primary.main", fontWeight: "bold", mt: 1}}>
							파일을 선택하거나 여기에 드롭하세요
						</Typography>
					</label>
				</Box>

				{selectedFile && (
					<Box mt={2}>
						<Typography>{selectedFile.name}</Typography>
						{uploading ? (
							<LinearProgress variant="determinate" value={uploadProgress} />
						) : (
							<Typography color="success.main">파일 선택 완료</Typography>
						)}
					</Box>
				)}
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} startIcon={<Cancel />} disabled={uploading}>
					취소
				</Button>
				<Button
					onClick={handleUpload}
					color="primary"
					variant="contained"
					disabled={!selectedFile || uploading}
				>
					업로드
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default FileUploadModal;
