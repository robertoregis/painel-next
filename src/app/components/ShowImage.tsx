'use client'
import "../style.css";

import React, { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
} from '@chakra-ui/react';
import Cropper from 'react-easy-crop';

const ShowImage = ({ img, isBig = false }: any) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [imageSrc, setImageSrc] = useState('');
    const [file, setFile] = useState<any>();
	
	return (
        <>
        {
            isBig ?
            <button onClick={onOpen} className={`w-[140px] bg-neutral-200/50 shadow p-1 rounded`}>
                <img src={img} alt="" className="max-w-full max-h-full" />
            </button>
            :
            <button onClick={onOpen} className={`w-[88px] bg-neutral-200/50 shadow p-1 rounded`}>
                <img src={img} alt="" className="max-w-full max-h-full" />
            </button>
        }
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
                        <img src={img} alt="" />
                    </div>
                </div>
                </ModalBody>
            </ModalContent>
        </Modal>
        </>
	)
}

export default ShowImage;