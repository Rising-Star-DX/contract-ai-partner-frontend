import { createTheme } from "@mui/material/styles";

const userTheme = createTheme({
    palette: {
        primary: {
            main: "#5686E1"
        },
        success: {
            main: "#5686E1"
        },
        warning: {
            main: "#FFCA28"
        },
        error: {
            main: "#EF5350"
        }
    },
    typography: {
        fontFamily: [
            "NanumSquareNeo",
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            "Roboto",
            '"Helvetica Neue"',
            "Arial",
            "sans-serif"
        ].join(",")
    },
    spacing: 4,
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: "#FFFFFF"
                }
            }
        }
    }
});

export default userTheme;
