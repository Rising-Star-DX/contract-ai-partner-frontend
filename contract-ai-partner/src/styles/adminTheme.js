import { createTheme } from "@mui/material/styles";

const adminTheme = createTheme({
    palette: {
        primary: {
            main: "#5686E1",
        },
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
            "sans-serif",
        ].join(","),
    },
    spacing: 4,
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: "#5686E1",
                },
            },
        },
    },
});

export default adminTheme;
