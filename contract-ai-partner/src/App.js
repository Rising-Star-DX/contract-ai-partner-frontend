import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ContractList from "./pages/ContractList";
import ContractReview from "./pages/ContractReview";
import StandardList from "./pages/StandardList";
import StandardDetail from "./pages/StandardDetail";
import CategoryList from "./pages/CategoryList";
import AIReport from "./pages/AIReport";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/agreements" element={<ContractList />} />
                <Route path="/standards" element={<StandardList />} />
                <Route path="/categories" element={<CategoryList />} />

                <Route path="/agreements/:id" element={<ContractReview />} />
                <Route path="/standards/:id" element={<StandardDetail />} />

                <Route path="/agreements/analysis/:id" element={<AIReport />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
