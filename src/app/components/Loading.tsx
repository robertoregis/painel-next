'use client'
import React, { useContext } from 'react';
import { 
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
} from '@chakra-ui/react';
import { RotatingLines } from 'react-loader-spinner';
import { ModalContext } from '../context/ModalContext';

const Loading = () => {
  const _modalContext = useContext(ModalContext)

  return (
    <Modal isCentered isOpen={_modalContext.isOpenLoading} onClose={_modalContext.onCloseLoading}>
      <ModalOverlay bg="rgba(0, 0, 0, 0.3)" />
      <ModalContent
        sx={{
          background: 'transparent', // remove o fundo branco
          border: 'none', // remove as bordas
          boxShadow: 'none', // remove qualquer sombra se estiver definida
        }}
      >
        <ModalBody className='flex justify-center items-center'>
        <div className='p-8'>
        <RotatingLines
          visible={true}
          height="110"
          width="110"
          strokeColor="white"
          strokeWidth="5"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
          wrapperStyle={{}}
          wrapperClass=""
          />
        </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default Loading;
