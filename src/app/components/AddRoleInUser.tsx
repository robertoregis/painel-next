'use client'
import "../style.css";

import React, { useState, useContext, useEffect } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
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

interface Role {
    id: string;
    name: string;
}

interface User {
    id: string;
    roles: Role[];
}

interface AddRoleInUserProps {
    user: User;
    isEdit?: boolean;
    changeUser: () => void;
}

const AddRoleInUser: React.FC<AddRoleInUserProps> = ({ user, isEdit = false, changeUser }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [roles, setRoles] = useState<Role[]>([])
    const [options, setOptions] = useState<{ value: string; label: string }[]>([])
    const [rolesSelected, setRolesSelected] = useState<{ value: string; label: string }[]>([])
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
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${_userContext?.token}`,
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao enviar requisição.');
            }

            const responseData = await response.json();
            setRoles(responseData.data.roles)

            const newOptions = responseData.data.roles.map((role: Role) => ({
                value: role.id,
                label: role.name,
            }));
            setOptions(newOptions)

            const myRoles = user.roles.map((role: Role) => ({
                value: role.id,
                label: role.name,
            }));
            setRolesSelected(myRoles)
            setLoading(false)
        } catch (error) {
            console.error('Erro ao enviar requisição:', error);
        }
    };

    const updateRolesForUserFetch = async () => {
        try {
            _modalContext.onOpenLoading()
            const roleIds = rolesSelected.map(role => role.value);
            const updateRolesForUser = {
                userId: user.id,
                roleIds: roleIds,
            };

            const response = await fetch('https://backend-my-site.onrender.com/users/update-roles', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
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
        } catch (error) {
            console.error('Erro ao enviar requisição:', error);
            _modalContext.onCloseLoading()
        }
    }

    useEffect(() => {
        getRolesFetch()
    }, [getRolesFetch])

    return (
        <>
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
                            <div className="col-span-1"></div>
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