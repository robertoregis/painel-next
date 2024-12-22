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

const PostView = ({ body }: any) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
	
	return (
        <>
        <button onClick={onOpen} className="bg-neutral-200/50 shadow p-1 rounded">
            Clique para ver
        </button>
        <Modal
            isCentered
            onClose={onClose}
            isOpen={isOpen}
            motionPreset='slideInBottom'
            size="xl"
            >
            <ModalOverlay />
            <ModalContent
            >
                <ModalBody>
                <div className="grid grid-cols-1 py-2">
                    <div className="col-span-1">
                        <span className="text-2xl font-[500]">Corpo:</span>
                    </div>
                    <div className="col-span-1 mt-4" dangerouslySetInnerHTML={{ __html: body }}></div>
                </div>
                </ModalBody>
            </ModalContent>
        </Modal>
        </>
	)
}

export default PostView;