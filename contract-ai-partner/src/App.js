import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import ContractList from "./pages/ContractList";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<ContractList />} />
				{/* <Route path="/detail/:id" element={<DocumentDetail />} 등등... */}
			</Routes>
		</BrowserRouter>
	);
}

export default App;
