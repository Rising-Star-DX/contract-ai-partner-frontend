import {ThemeProvider} from "@emotion/react";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import userTheme from "./styles/userTheme";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
	<ThemeProvider theme={userTheme}>
		<App />
	</ThemeProvider>,
);
