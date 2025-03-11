import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";

import ContractList from "./pages/ContractList";
import ContractReview from "./pages/ContractReview";
import StandardList from "./pages/StandardList";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/agreement" element={<ContractList />} />
				<Route path="/contract-review" element={<ContractReview />} />
				<Route path="/standards" element={<StandardList />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
