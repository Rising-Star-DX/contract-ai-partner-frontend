// src/contexts/RoleContext.js
import { createContext } from "react";

// role과 setter를 함께 제공할 Context
const RoleContext = createContext({
    role: "user",
    setRole: () => {},
});

export default RoleContext;
