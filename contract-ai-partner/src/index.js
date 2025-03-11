import React from "react";
import ReactDOM from "react-dom/client";
import {ThemeProvider} from "@mui/material/styles";

import App from "./App";

// 두 가지 테마
import userTheme from "./styles/userTheme";
import adminTheme from "./styles/adminTheme";

function Root() {
	const role = "admin";

	// 로그인 이후 적용할 코드
	// const [role, setRole] = useState("admin");

	// useEffect(() => {
	// 	const storedRole = localStorage.getItem("role");
	// 	setRole(storedRole);
	// }, []);

	// role에 따라 관리자 테마 / 사용자 테마 적용
	const theme = role === "admin" ? adminTheme : userTheme;

	return (
		<ThemeProvider theme={theme}>
			<App />
		</ThemeProvider>
	);
}

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<Root />);
