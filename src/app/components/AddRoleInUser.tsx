'use client'
import "../style.css";

import React, { useState, useContext, useEffect } from 'react';
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
    FormControl,
    FormLabel
} from '@chakra-ui/react';
import Select from 'react-select';
import { MdOutlineRule } from "react-icons/md";
import { UserContext } from "../context/UserContext";
import { ModalContext } from "../context/ModalContext";

const AddRoleInUser = ({ user, isEdit = false, changeUser }: any) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [roles, setRoles] = useState<any[]>([])
    const [options, setOptions] = useState<any[]>([])
    const [rolesSelected, setRolesSelected] = useState<any[]>()
    /*const [updateRolesForUser, setUpdateRolesForUser] = useState<any>({
        userId: null,
        roleIds: []
    })*/
    const [loading, setLoading] = useState<boolean>(true)
    const _userContext = useContext(UserContext)
    const _modalContext = useContext(ModalContext)
    const handlePermissionsChange = (value: any) => {
        setRolesSelected(value)
    }

    const getRolesFetch = async () => {
        try {
          const response = await fetch('https://backend-my-site.onrender.com/roles', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json', // Tipo de conteúdo que você está enviando
              'Authorization': `Bearer ${_userContext?.token}`,
            }
          });
          
          if (!response.ok) {
            throw new Error('Erro ao enviar requisição.');
          }
    
          const responseData = await response.json();
          setRoles(responseData.data.roles)
          let newOptions: any = []
          responseData.data.roles.forEach((role: any) => {
            newOptions.push({
                value: role.id,
                label: role.name
            })
          })
          setOptions(newOptions)
          let myRoles: any = []
          if(user.roles.length) {
            user.roles.forEach((role: any) => {
                myRoles.push({
                    value: role.id,
                    label: role.name
                })
            })
          }
          setRolesSelected(myRoles)
          setLoading(true)
          console.log('Resposta da API:', responseData);
        } catch (error) {
          console.error('Erro ao enviar requisição:', error);
        }
    };

    const updateRolesForUserFetch = async () => {
        try {
            _modalContext.onOpenLoading()
            let updateRolesForUser: any = {
                userId: null,
                roleIds: []
            }
            if(rolesSelected?.length) {
                let roleIds: any = []
                rolesSelected.forEach((role: any) => {
                    roleIds.push(role.value)
                })
                updateRolesForUser = ({
                    userId: user.id,
                    roleIds: roleIds
                });
            }
            const response = await fetch('https://backend-my-site.onrender.com/users/update-roles', {
                method: 'PUT',
                headers: {
                'Content-Type': 'application/json', // Tipo de conteúdo que você está enviando
                'Authorization': `Bearer ${_userContext?.token}`,
                },
                body: JSON.stringify(updateRolesForUser),
            });
            
            if (!response.ok) {
                _modalContext.onCloseLoading()
                throw new Error('Erro ao enviar requisição.');
            }
            _modalContext.onCloseLoading()
            changeUser()
            const responseData = await response.json();
            console.log('Resposta da API:', responseData);
            onClose()
            //router.push('/jogadores')
        } catch (error) {
            console.error('Erro ao enviar requisição:', error);
            _modalContext.onCloseLoading()
        }
    }
    
    useEffect(() => {
        getRolesFetch()
    }, [])
	
	return (
        <>
        {/*<button onClick={onOpen} className="w-[68px] bg-neutral-200/50 shadow p-1 rounded">
            Clique
        </button>*/}
        <Button onClick={onOpen} leftIcon={<MdOutlineRule size={20} />} colorScheme='teal' size={`${isEdit ? `md` : `sm`}`}>{isEdit ? `Editar regras` : `Regras`}</Button>
        <Modal
            isCentered
            onClose={onClose}
            isOpen={isOpen}
            motionPreset='slideInBottom'
            >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Editar regras</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                <div className="grid grid-cols-1 mb-2">
                    <div className="col-span-1">
                    </div>
                    <div className="col-span-1 mt-2">
                    <FormControl>
                        <FormLabel>Regras:</FormLabel>
                        <Select
                            isMulti
                            options={options}
                            value={rolesSelected}
                            onChange={handlePermissionsChange}
                            placeholder='Selecione'
                            noOptionsMessage={() => 'Nenhuma opção disponível'}
                        />
                    </FormControl>
                    </div>
                    <div className="col-span-1 mt-4">
                    <div className="flex items-center">
                        <Button style={{ backgroundColor: "#718096", color: "white" }} className="mr-2">Limpar</Button>
                        <Button onClick={updateRolesForUserFetch} colorScheme='green' className="mr-2">Salvar</Button>
                    </div>
                    </div>
                </div>
                </ModalBody>
            </ModalContent>
        </Modal>
        </>
	)
}

export default AddRoleInUser;