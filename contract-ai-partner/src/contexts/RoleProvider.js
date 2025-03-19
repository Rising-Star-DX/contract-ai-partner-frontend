// src/contexts/RoleProvider.js
import React from "react";
import RoleContext from "./RoleContext";

function RoleProvider({children}) {
	const role = "admin";

	// 로그인 구현 되면 활성화 할 부분
	// const [role, setRole] = useState(null);

	// useEffect(() => {
	// 	// 로컬 스토리지에서 role 가져오기
	// 	const storedRole = localStorage.getItem("role"); // "admin" or "user"

	// 	if (storedRole) {
	// 		setRole(storedRole);
	// 	} else {
	// 		// 저장된 role이 없으면 기본값 \"user\" (또는 null)
	// 		setRole("user");
	// 	}
	// }, []);

	return <RoleContext.Provider value={role}>{children}</RoleContext.Provider>;
}

export default RoleProvider;
