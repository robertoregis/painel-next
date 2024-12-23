'use client'
import Image from "next/image";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Avatar,
  Checkbox,
  Button,
  Box,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  IconButton,
  Wrap,
  Tooltip,
  SkeletonText,
  useToast,
} from '@chakra-ui/react';
import { ChevronRightIcon, DeleteIcon } from '@chakra-ui/icons';
import React, { useEffect, useState, useContext } from "react";
import { useRouter } from 'next/navigation';
import { UserContext } from "@/app/context/UserContext";
import { textSlice } from "@/app/utils/textFormatters";
import { IoEnter } from "react-icons/io5";
import { MdModeEdit } from "react-icons/md";
import ConfirmationModal from "@/app/components/ConfirmationModal";
import { showToast } from "@/app/utils/chakra";
import { removeFromLocalStorage } from "@/app/utils/localStorage";
import ToolsMenu from "@/app/components/ToolsMenu";
import NotData from "@/app/components/NotData";
import { ModalContext } from "@/app/context/ModalContext";

export default function Home() {
  const [users, setUsers] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter();
  const _userContext = useContext(UserContext)
  const _modalContext = useContext(ModalContext)
  const toast = useToast()
  const [isSelectAll, setIsSelectAll] = useState<boolean>(false)
  const [countIsSelect, setCountIsSelect] = useState<number>(0)
  const optionsToolsMenu: any = []

  const goRouter = (href: string) => {
    router.push(href)
  }

  const logout = () => {
    removeFromLocalStorage('user_data_client')
    _userContext?.setToken('')
    _userContext?.setUser({})
    router.push('/login')
  }

  const getUsersFetch = async () => {
    try {
      const response = await fetch('https://backend-my-site.onrender.com/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json', // Tipo de conteúdo que você está enviando
          'Authorization': `Bearer ${_userContext?.token}`,
        }
      });
      
      if (!response.ok) {
        const responseData = await response.json();
        if(responseData.error === "Unauthorized") {
          showToast({
            title: 'Erro de autenticação',
            description: 'Você será deslogado',
            status: 'error'
          }, toast);
          logout()
          return
        }
      }

      const responseData = await response.json();
      if(responseData.status !== 0) {
        const usersWithIsSelect = responseData.data.users.map((user: any) => ({
          ...user,
          isSelect: false
        }));
        setUsers(usersWithIsSelect);
        setLoading(false)
      } else {
        showToast({
          description: responseData.message,
          status: 'error'
        }, toast);
      }
      //console.log('Resposta da API:', responseData);
    } catch (error) {
      console.error('Request Error: An issue occurred', error);
      showToast({
        title: 'Request Error: An issue occurred',
        status: 'error'
      }, toast);
    }
  };

  // Função para alterar o estado de isSelect de todos os usuários
  const changeSelectAll = (value: any) => {
    const { checked } = value.target;
    setIsSelectAll(checked);
    setUsers((prevUsers: any) => {
        const updatedUsers = prevUsers.map((user: any) => ({
            ...user,
            isSelect: checked
        }));
        updateCountIsSelect(updatedUsers);
        return updatedUsers;
    });
  };

  // Função para alterar o estado de isSelect de um usuário específico
  const changeUserSelect = (value: any, userId: string) => {
      const { checked } = value.target;
      setUsers((prevUsers: any) => {
          const updatedUsers = prevUsers.map((user: any) => 
              user.id === userId ? { ...user, isSelect: checked } : user
          );
          updateCountIsSelect(updatedUsers);
          return updatedUsers;
      });
  };

  const updateCountIsSelect = (users: any[]) => {
    const count = users.filter(user => user.isSelect).length;
    setCountIsSelect(count);
  };

  const removeUserFetch = async (userId: string) => {
    try {
      _modalContext.onOpenLoading()
      const response = await fetch(`https://backend-my-site.onrender.com/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json', // Tipo de conteúdo que você está enviando
          'Authorization': `Bearer ${_userContext?.token}`,
        }
      });

      if (!response.ok) {
        const responseData = await response.json();
        if(responseData.error === "Unauthorized") {
          _modalContext.onCloseLoading()
          showToast({
            title: 'Erro de autenticação',
            description: 'Você será deslogado',
            status: 'error'
          }, toast);
          logout()
          return
        }
      }
      
      const responseData = await response.json();
      if(responseData.status !== 0) {
        setUsers(responseData.data.users)
        showToast({
          description: responseData.message,
          status: 'success'
        }, toast);
      } else {
        setUsers(responseData.data.users)
        showToast({
          description: responseData.message,
          status: 'error'
        }, toast);
      }
      _modalContext.onCloseLoading()
      //console.log('Resposta da API:', responseData);
    } catch (error) {
      _modalContext.onCloseLoading()
      console.error('Request Error: An issue occurred', error);
      showToast({
        title: 'Request Error: An issue occurred',
        status: 'error'
      }, toast);
    }
  };

  const onDataConfirmation = (password: string) => {
    if(password) {
      removeUsers(password)
    }
  }

  const removeUsers = async (password: string) => {
    const userIds = users
      .filter((user: any) => user.isSelect) // Filtra usuários com isSelect = true
      .map((user: any) => user.id); // Extrai apenas os IDs
    // Construir o objeto `data`
    let data = {
      requestPassword: password,
      userIds: userIds
    };
    try {
      _modalContext.onOpenLoading()
      const response = await fetch('https://backend-my-site.onrender.com/users', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json', // Tipo de conteúdo que você está enviando
          'Authorization': `Bearer ${_userContext?.token}`,
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const responseData = await response.json();
        if(responseData.error === "Unauthorized") {
          _modalContext.onCloseLoading()
          showToast({
            title: 'Erro de autenticação',
            description: 'Você será deslogado',
            status: 'error'
          }, toast);
          logout()
          return
        }
      }

      const responseData = await response.json();
      if(responseData.status !== 0) {
        showToast({
          description: responseData.message,
          status: 'success'
        }, toast);
      } else {
        showToast({
          description: responseData.message,
          status: 'error'
        }, toast);
      }
      _modalContext.onCloseLoading()
    } catch (error) {
      _modalContext.onCloseLoading()
      console.error('Request Error: An issue occurred', error);
      showToast({
        title: 'Request Error: An issue occurred',
        status: 'error'
      }, toast);
    }
  }

  const editUser = (userId: string) => {
    router.push(`/feed/usuarios/editar/${userId}`)
  }

  const showUser = (href: string) => {
    router.push(href)
  }

  useEffect(() => {
    getUsersFetch()
  }, [])

  return (
    <main className="flex w-full p-4">
      <div className="grid grid-cols-1 w-full">

        <div className="col-span-1 bg-white shadow-lg rounded p-2">
          <div className="flex items-center justify-between">
            <Breadcrumb spacing='4px' separator={<ChevronRightIcon w={5} h={5} color='black' />}>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink color="black">Usuarios</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
            <div className="flex items-center">
              <ToolsMenu options={optionsToolsMenu} />
            </div>
          </div>
        </div>

        <div className="col-span-1 mt-4">
          <h1 className="mb-0 text-xl lg:text-2xl">Usuarios</h1>
        </div>

        <div className="col-span-1 mt-4 bg-white shadow-lg rounded p-3">
          <div className="flex">
            <Button onClick={() => goRouter('/feed/usuarios/criar')} colorScheme="green">
              Criar usuário
            </Button>
          </div>
        </div>

        {
          !loading ?  
          <div className="col-span-1 mt-4 bg-white shadow-lg rounded p-3">
            {
              countIsSelect > 0 && (
                <>
                <div className="grid grid-cols-1 mb-1">
                  <div className="col-span-1">
                  <Button onClick={() => _modalContext.onOpenConfirmation()} colorScheme='red' size="sm">Excluir selecionados</Button>
                  </div>
                </div>
                </>
              )
            }
            { users.length > 0 ?
            <div className="grid grid-cols-1">
                <TableContainer>
                  <Table size='sm' className="hidden md:table">
                    <Thead>
                      <Tr>
                        <Th>
                          <div className="flex items-center">
                            <Tooltip label="Selecionar tudo">
                              <Checkbox onChange={(value: any) => changeSelectAll(value)} isChecked={isSelectAll} className="mr-2"></Checkbox>
                            </Tooltip>
                            Nome
                          </div>
                        </Th>
                        <Th textAlign="center">ID</Th>
                        <Th textAlign="center">E-mail</Th>
                        <Th textAlign="right">Data de criação</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {users.map((user: any, index: any) => (
                        <Tr>
                        <Td>
                          <div className="flex items-center">
                            <Checkbox isChecked={user.isSelect} onChange={(value: any) => changeUserSelect(value, user.id)}></Checkbox>
                            <Popover placement='bottom-end'>
                              <PopoverTrigger>
                                <Box as='button' className="flex items-center ml-2">
                                <Avatar size="sm" name={user.username} src={user.imageUrl} />
                                <span className="ml-2 font-[500]">{user.username}</span>
                              </Box>
                              </PopoverTrigger>
                              <PopoverContent maxW="180px">
                                <PopoverBody className="flex justify-center">
                                  <Wrap>
                                    <Tooltip label="Visualizar">
                                    <IconButton
                                      onClick={() => showUser(user.uri)}
                                      aria-label='Visualizar usuário'
                                      icon={<IoEnter />}
                                    />
                                    </Tooltip>
                                    <Tooltip label="Excluir">
                                    <IconButton
                                      onClick={() => removeUserFetch(user.id)}
                                      aria-label='Excluir usuário'
                                      icon={<DeleteIcon />}
                                    />
                                    </Tooltip>
                                    <Tooltip label="Editar">
                                    <IconButton
                                      onClick={() => editUser(user.id)}
                                      aria-label='Editar usuário'
                                      icon={<MdModeEdit />}
                                    />
                                    </Tooltip>
                                  </Wrap>
                                </PopoverBody>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </Td>
                        <Td textAlign="center">
                          <Tooltip label={user.id}>
                            {textSlice(user.id, 9)}
                          </Tooltip>
                        </Td>
                        <Td  textAlign="center">{user.email}</Td>
                        <Td textAlign="right">{user.createdAt}</Td>
                      </Tr>
                      ))}
                    </Tbody>
                  </Table>
                  <Table size='sm' className="md:hidden">
                    <Thead>
                      <Tr>
                        <Th>
                          <div className="flex items-center">
                            <Tooltip label="Selecionar tudo">
                              <Checkbox onChange={(value: any) => changeSelectAll(value)} isChecked={isSelectAll} className="mr-2"></Checkbox>
                            </Tooltip>
                            Nome
                          </div>
                        </Th>
                        <Th textAlign="center">ID</Th>
                        <Th textAlign="center">E-mail</Th>
                        <Th textAlign="right">Data de criação</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {users.map((user: any, index: any) => (
                      <Tr>
                        <Td>
                          <div className="flex items-center">
                            <Checkbox></Checkbox>
                            <Popover placement='bottom-end'>
                              <PopoverTrigger>
                                <Box as='button' className="flex items-center ml-2">
                                <Avatar size="sm" name={user.username} src={user.imageUrl} />
                                <span className="ml-2 font-[500]">{user.username}</span>
                              </Box>
                              </PopoverTrigger>
                              <PopoverContent maxW="180px">
                                <PopoverBody className="flex justify-center">
                                  <Wrap>
                                    <Tooltip label="Visualizar">
                                    <IconButton
                                      onClick={() => showUser(user.uri)}
                                      aria-label='Visualizar usuário'
                                      icon={<IoEnter />}
                                    />
                                    </Tooltip>
                                    <Tooltip label="Excluir">
                                    <IconButton
                                      onClick={() => removeUserFetch(user.id)}
                                      aria-label='Excluir usuário'
                                      icon={<DeleteIcon />}
                                    />
                                    </Tooltip>
                                    <Tooltip label="Editar">
                                    <IconButton
                                      onClick={() => editUser(user.id)}
                                      aria-label='Editar usuário'
                                      icon={<MdModeEdit />}
                                    />
                                    </Tooltip>
                                  </Wrap>
                                </PopoverBody>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </Td>
                        <Td textAlign="center">
                          <Tooltip label={user.id}>
                            {textSlice(user.id, 9)}
                          </Tooltip>
                        </Td>
                        <Td  textAlign="center">{user.email}</Td>
                        <Td textAlign="right">{user.createdAt}</Td>
                      </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
            </div>
            : <>
              <NotData title="Nenhum usuário encontrado" />
            </> }

          </div>
          : <>
          <div className="col-span-1 bg-white shadow-lg rounded p-3 mt-4">
            <SkeletonText mt="4" noOfLines={1} skeletonHeight='120' className="w-full" />
          </div>
          </>
        }

      </div>
      <ConfirmationModal onDataConfirmation={onDataConfirmation} />
    </main>
  );
}
