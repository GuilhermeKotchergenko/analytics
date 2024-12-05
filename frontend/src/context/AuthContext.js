import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

const AuthContextProvider = (props) => {
    const [authData, setAuthData] = useState(null);

    return (
        <AuthContext.Provider value={{ authData, setAuthData }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContextProvider;
