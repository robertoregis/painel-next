'use client'
import React, { createContext, ReactNode } from 'react';
import {
	useDisclosure
} from '@chakra-ui/react';

interface ModalContextType {
    isOpenLoading: boolean;
    onOpenLoading: () => void;
    onCloseLoading: () => void;
    isOpenConfirmation: boolean;
    onOpenConfirmation: () => void;
    onCloseConfirmation: () => void;
}

const defaultContextValue: ModalContextType = {
    isOpenLoading: false,
    onOpenLoading: () => {},
    onCloseLoading: () => {},
    isOpenConfirmation: false,
    onOpenConfirmation: () => {},
    onCloseConfirmation: () => {},
  };
  
export const ModalContext = createContext<ModalContextType>(defaultContextValue);

interface ModalProviderProps {
    children: ReactNode;
}

function ModalProvider({ children }: ModalProviderProps) {
    const { isOpen: isOpenLoading, onOpen: onOpenLoading, onClose: onCloseLoading } = useDisclosure()
    const { isOpen: isOpenConfirmation, onOpen: onOpenConfirmation, onClose: onCloseConfirmation } = useDisclosure()
    return (
        <ModalContext.Provider value={{ isOpenLoading, onOpenLoading, onCloseLoading, isOpenConfirmation, onOpenConfirmation, onCloseConfirmation }}>
            {children}
        </ModalContext.Provider>
    );
}

export default ModalProvider;