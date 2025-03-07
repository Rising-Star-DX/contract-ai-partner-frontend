import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";

import ContractList from "./pages/ContractList";
import ContractReview from "./pages/ContractReview";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<ContractList />} />
				<Route path="/contract-review" element={<ContractReview />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
