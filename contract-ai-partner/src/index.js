import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";

import App from "./App";

// 두 가지 테마
import userTheme from "./styles/userTheme";
import adminTheme from "./styles/adminTheme";

import RoleProvider from "./contexts/RoleProvider";
import RoleContext from "./contexts/RoleContext";

// 카테고리
import { CategoryProvider } from "./contexts/CategoryContext";

function Root() {
    return (
        <RoleProvider>
            <CategoryProvider>
                <ThemeWrapper>
                    <App />
                </ThemeWrapper>
            </CategoryProvider>
        </RoleProvider>
    );
}

function ThemeWrapper({ children }) {
    const role = React.useContext(RoleContext);

    // role이 아직 null이면 기본 userTheme
    const currentTheme = role === "admin" ? adminTheme : userTheme;

    return <ThemeProvider theme={currentTheme}>{children}</ThemeProvider>;
}

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<Root />);
