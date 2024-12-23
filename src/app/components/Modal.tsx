'use client'
import "../style.css";

import React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    useDisclosure,
} from '@chakra-ui/react';

const ModalComponent = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
	
	return (
        <>
        <button onClick={onOpen} className="w-[68px] bg-neutral-200/50 shadow p-1 rounded">
            Clique
        </button>
        <Modal
            isCentered
            onClose={onClose}
            isOpen={isOpen}
            motionPreset='slideInBottom'
            >
            <ModalOverlay />
            <ModalContent
                bg="transparent"  // Define o fundo como transparente
                border="none"     // Remove a borda padrão (opcional)
                boxShadow="none"  // Remove a sombra padrão (opcional)
                p={0}             // Remove o espaçamento interno padrão (opcional)
            >
                <ModalBody>
                <div className="grid grid-cols-1">
                    <div className="col-span-1">
                    </div>
                </div>
                </ModalBody>
            </ModalContent>
        </Modal>
        </>
	)
}

export default ModalComponent;