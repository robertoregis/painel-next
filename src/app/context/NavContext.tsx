'use client'
import React, { createContext, useContext, useState, ReactNode, useRef } from 'react';
import {
	useDisclosure
} from '@chakra-ui/react';

interface NavContextType {
    nav: any;
    setNav: React.Dispatch<React.SetStateAction<any>>;
    navRef: any;
    isOpen: any;
    onOpen: any;
    onClose: any;
}

export const NavContext = createContext<NavContextType | undefined>(undefined);

interface NavProviderProps {
    children: ReactNode;
}

function NavProvider({ children }: NavProviderProps) {
    const navRef = useRef()
    const [nav, setNav] = useState<any>({
        isShowNav: true,
        test: 'OI, teste!'
    });
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <NavContext.Provider value={{ nav, setNav, navRef, isOpen, onOpen, onClose }}>
            {children}
        </NavContext.Provider>
    );
}

export default NavProvider;