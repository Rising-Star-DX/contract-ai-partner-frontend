import React, { useState, useEffect } from "react";
import RoleContext from "./RoleContext";

function RoleProvider({ children }) {
    // 1) role 상태 정의
    const [role, setRole] = useState("user");

    // 2) (선택) 로컬스토리지 동기화
    useEffect(() => {
    const stored = localStorage.getItem("role");
    
    if (stored === "admin" || stored === "user") {
        setRole(stored);
    }
    }, []);

    // 3) role 변경 시 로컬스토리지에도 저장
    useEffect(() => {
        localStorage.setItem("role", role);
    }, [role]);

    return (
        <RoleContext.Provider value={{ role, setRole }}>
            {children}
        </RoleContext.Provider>
    );
}

export default RoleProvider;
