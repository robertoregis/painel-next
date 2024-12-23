'use client'
import React, { useState, useContext } from 'react';
import { 
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  InputGroup,
  Input,
  InputRightElement
} from '@chakra-ui/react';
import { ModalContext } from '../context/ModalContext';


const ConfirmationModal = ({ onDataConfirmation }: any) => {
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const _modalContext = useContext(ModalContext)
  const handleClick = () => setShowPassword(!password)
  const handlePasswordChange = (e: any) => {
    let inputValue = e.target.value
    setPassword(inputValue);
  }

  const sendData = () => {
    onDataConfirmation(password)
    _modalContext.onCloseConfirmation()
    setPassword('')
  }

  return (
    <Modal isCentered isOpen={_modalContext.isOpenConfirmation} onClose={_modalContext.onCloseConfirmation}>
      <ModalOverlay bg="rgba(0, 0, 0, 0.3)" />
      <ModalContent>
        <ModalHeader>Digite a sua senha</ModalHeader>
        <ModalCloseButton />
        <ModalBody className='flex justify-center items-center'>
        <div className='grid grid-cols-1 w-full'>
          <div className="col-span-1">
            <FormControl>
              <InputGroup size='md'>
                <Input
                  pr='4.5rem'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Digite sua senha'
                  bg="rgba(255, 255, 255, 0.8)" textColor="black"
                  value={password}
                  onChange={handlePasswordChange}
                />
                <InputRightElement width='4.75rem'>
                  <Button h='1.75rem' size='sm' onClick={handleClick} className="mr-2">
                    {showPassword ? 'Esconder' : 'Mostrar'}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </div>
        </div>
        </ModalBody>
        <ModalFooter>
          <Button onClick={sendData} isDisabled={password ? false : true} colorScheme='green'>Continuar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmationModal;
