import { createContext } from 'react';

const UserContext = createContext({
    user: { email: "", firstname: "", name: "" },
    setUser: (prop) => { },
});

export { UserContext };
