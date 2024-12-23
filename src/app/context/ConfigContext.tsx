'use client'
import React, { createContext, useState, ReactNode } from 'react';

interface ConfigContextType {
    config: any;
    setConfig: React.Dispatch<React.SetStateAction<any>>;
    isLoaded: boolean;
    setIsLoaded: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

interface ConfigProviderProps {
    children: ReactNode;
}

function ConfigProvider({ children }: ConfigProviderProps) {
    const [config, setConfig] = useState<any>({});
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    return (
        <ConfigContext.Provider value={{ config, setConfig, isLoaded, setIsLoaded }}>
            {children}
        </ConfigContext.Provider>
    );
}

export default ConfigProvider;
