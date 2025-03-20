import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
// QueryClient
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App";

// 두 가지 테마
import userTheme from "./styles/userTheme";
import adminTheme from "./styles/adminTheme";

import RoleProvider from "./contexts/RoleProvider";
import RoleContext from "./contexts/RoleContext";

// 카테고리
import { CategoryProvider } from "./contexts/CategoryContext";

// 쿼리 클라이언트 - 캐시 데이터 업데이트 라이브러리
const queryClient = new QueryClient();

function Root() {
    return (
        <QueryClientProvider client={queryClient}>
            <RoleProvider>
                <CategoryProvider>
                    <ThemeWrapper>
                        <App />
                    </ThemeWrapper>
                </CategoryProvider>
            </RoleProvider>
        </QueryClientProvider>
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
