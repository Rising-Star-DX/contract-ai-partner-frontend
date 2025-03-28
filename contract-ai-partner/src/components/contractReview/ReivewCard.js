// (1) forwardRef로 감싸야 부모에서 ref={(el) => ...}를 통해 DOM에 접근 가능
import React, { forwardRef } from "react";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Box,
    Chip,
    Divider
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const ReviewCard = forwardRef(
    (
        {
            number,
            title,
            originalText,
            page,
            confidence,
            reviewOpinion,
            suggestion,
            isOpen,
            onChange,
            onEntered
        },
        ref
    ) => (
        <Box ref={ref}>
            {/* (3) expanded={isOpen}로 제어 */}
            <Accordion
                elevation={2}
                expanded={Boolean(isOpen)}
                onChange={onChange}
                slotProps={{ transition: { onEntered } }}
                sx={{
                    borderRadius: "8px",
                    mb: 3,
                    px: 6,
                    "&.Mui-expanded": {
                        marginBottom: "24px !important"
                    }
                }}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                        ".MuiAccordionSummary-content": {
                            display: "flex",
                            alignItems: "center",
                            flex: 1,
                            minWidth: 0
                        }
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            fontFamily: "NanumSquareNeoHeavy",
                            flex: 1,
                            minWidth: 0,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            textAlign: "start"
                        }}
                    >
                        #{number} {title}
                    </Typography>
                </AccordionSummary>

                <AccordionDetails>
                    <Box mb={2}>
                        <Typography
                            variant="h6"
                            color="text.secondary"
                            sx={{ fontFamily: "NanumSquareNeoExtraBold" }}
                        >
                            📍 원문{" "}
                            <Chip
                                label={`${page} 페이지`}
                                size="small"
                                variant="outlined"
                                sx={{ ml: 1, fontSize: "10px" }}
                            />
                        </Typography>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ whiteSpace: "pre-wrap", mt: 3 }}
                        >
                            {originalText}
                        </Typography>
                    </Box>

                    <Box my={4}>
                        <Typography
                            variant="h5"
                            color="primary"
                            sx={{ fontFamily: "NanumSquareNeoHeavy" }}
                        >
                            🔍 검토 의견{" "}
                            <Typography
                                component="span"
                                color="text.secondary"
                                variant="subtitle1"
                                sx={{ fontFamily: "NanumSquareNeoHeavy" }}
                            >
                                신뢰도{" "}
                                <span
                                    style={{
                                        color: "#2ecc71",
                                        fontWeight: "bold"
                                    }}
                                >
                                    {confidence}%
                                </span>
                            </Typography>
                        </Typography>
                        <Typography
                            fontSize="18px"
                            fontWeight="bold"
                            sx={{ mt: 4 }}
                        >
                            {reviewOpinion}
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 4 }} />

                    <Box>
                        <Typography
                            variant="h5"
                            color="primary"
                            sx={{ fontFamily: "NanumSquareNeoHeavy" }}
                            mb={4}
                        >
                            ✅ 제안 문구
                        </Typography>
                        <Typography
                            variant="body2"
                            fontSize="18px"
                            color="black"
                            sx={{
                                whiteSpace: "pre-wrap",
                                mb: 4,
                                fontFamily: "NanumSquareNeoBold"
                            }}
                        >
                            {suggestion}
                        </Typography>
                    </Box>
                </AccordionDetails>
            </Accordion>
        </Box>
    )
);

export default ReviewCard;
