'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserContextType {
    user: any;
    token: string;
    setUser: React.Dispatch<React.SetStateAction<any>>;
    setToken: React.Dispatch<React.SetStateAction<string>>;
    isLoaded: boolean;
    setIsLoaded: React.Dispatch<React.SetStateAction<boolean>>;
    permissions: any[];
    setPermissions: React.Dispatch<React.SetStateAction<any[]>>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
    children: ReactNode;
}

function UserProvider({ children }: UserProviderProps) {
    const [user, setUser] = useState<any>({});
    const [token, setToken] = useState<string>('');
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [permissions, setPermissions] = useState<any[]>([]);

    return (
        <UserContext.Provider value={{ user, token, setUser, setToken, isLoaded, setIsLoaded, permissions, setPermissions }}>
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;
