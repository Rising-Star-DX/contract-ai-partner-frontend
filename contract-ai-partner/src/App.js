import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ContractList from "./pages/ContractList";
import ContractReview from "./pages/ContractReview";
import StandardList from "./pages/StandardList";
import StandardDetail from "./pages/StandardDetail";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/agreement" element={<ContractList />} />
                <Route path="/standards" element={<StandardList />} />

                <Route path="/agreement/:id" element={<ContractReview />} />
                <Route path="/standards/:id" element={<StandardDetail />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
