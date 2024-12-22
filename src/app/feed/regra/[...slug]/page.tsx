'use client'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Select,
  useToast,
  SkeletonText,
  Avatar,
  Box,
  IconButton,
  Tooltip,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Stack,
  StackDivider,
  Text,
  Heading,
  Badge
} from '@chakra-ui/react';
import { Link } from '@chakra-ui/next-js'
//import Link from 'next/link';
import { ChevronRightIcon, EmailIcon } from '@chakra-ui/icons';
import { MdEdit, MdLocalPolice } from "react-icons/md";
import React, { useEffect, useState, useContext } from "react";
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { UserContext } from '@/app/context/UserContext';
import AddRoleInUser from '@/app/components/AddRoleInUser';
import ToolsMenu from '@/app/components/ToolsMenu';
import ShowImage from '@/app/components/ShowImage';
import { removeFromLocalStorage } from '@/app/utils/localStorage';
import { showToast } from '@/app/utils/chakra';
import { ModalContext } from '@/app/context/ModalContext';

export default function Home() {
  const [show, setShow] = React.useState(false)
  const handleClick = () => setShow(!show)
  const _userContext = useContext(UserContext);
  const _modalContext = useContext(ModalContext);
  const router = useRouter();
  const [userRole, setRoleId] = useState<any>(null)
  const [role, setRole] = useState<any>({})
  const toast = useToast()
  const [loading, setLoading] = useState<boolean>(true)
  const params: any = useParams()
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

  const getRoleFetch = async () => {
    try {
      const response = await fetch(`https://backend-my-site.onrender.com/roles/${params.slug[0]}`, {
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
        setRole(responseData.data.role)
      } else {
        showToast({
          description: responseData.message,
          status: 'error'
        }, toast);
      }
      //console.log('Resposta da API - visualizar usuário:', responseData);
      setLoading(false)
    } catch (error) {
      console.error('Request Error: An issue occurred', error);
      showToast({
        title: 'Request Error: An issue occurred',
        status: 'error'
      }, toast);
    }
  };

  useEffect(() => {
    setRoleId(params.slug[0])
    getRoleFetch()
  }, [])

  return (
    <main className="flex w-full p-4">
      <div className="grid grid-cols-1 w-full">
        <div className="col-span-1 bg-white shadow-lg rounded p-2">
        <div className="flex items-center justify-between">
          <Breadcrumb spacing='4px' separator={<ChevronRightIcon w={5} h={5} color='black' />}>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => goRouter('/feed/regras')} color="black">Permissões</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink color="black">Visualizar</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink color="black">{role.name}</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          <div className="flex items-center">
            <ToolsMenu options={optionsToolsMenu} />
          </div>
        </div>
        </div>
        <div className="col-span-1 mt-4">
          <h1 className="mb-0 text-xl lg:text-2xl">{role.name}</h1>
        </div>
        <div className="col-span-1 mt-4 bg-white shadow-lg rounded p-3">
          <p className="mb-0">Visualizar permissão</p>
        </div>
        {
          !loading ?
          <div className="col-span-1 mt-4">
            <div className="grid grid-cols-1 mt-4 mb-4">
              <div className="col-span-1 bg-white shadow-lg p-0 md:p-1 xl:p-2 rounded">
                <Card boxShadow="none" border="none">
                  <CardHeader>
                    <Heading size='md'>Informações:</Heading>
                  </CardHeader>

                  <CardBody paddingTop={2}>
                    <Stack divider={<StackDivider />} spacing='2'>
                      <Box>
                        <Heading mb={1} size='xs' textTransform='uppercase'>
                          Nome:
                        </Heading>
                        <Text mb={1} fontSize='sm'>
                          {role.name}
                        </Text>
                      </Box>
                      <Box>
                        <Heading mb={1} size='xs' textTransform='uppercase'>
                          Permissões:
                        </Heading>
                        {
                          role.permissions ? (
                            <div className="flex flex-wrap">
                              {
                                role.permissions.map((permission: any) => (
                                  <Badge variant='solid' colorScheme='orange' className='mr-2 p-1'>
                                    {permission.label}
                                  </Badge>
                                ))
                              }
                            </div>
                          ) : <>
                            <Text mb={1} fontSize='sm'>Sem permissões</Text>
                          </>
                        }
                      </Box>
                      <Box>
                        <Heading mb={1} size='xs' textTransform='uppercase'>
                          Data de criação:
                        </Heading>
                        <Text mb={1} fontSize='sm'>
                          {role.createdAt}
                        </Text>
                      </Box>
                      <Box>
                        <Heading mb={1} size='xs' textTransform='uppercase'>
                          Data de atualização:
                        </Heading>
                        <Text mb={1} fontSize='sm'>
                          {role.updatedAt}
                        </Text>
                      </Box>
                    </Stack>
                  </CardBody>

                  <CardFooter paddingTop={1}>
                    <Button onClick={() => goRouter(`/feed/regras/editar/${role.id}`)} leftIcon={<MdEdit />} colorScheme='teal' variant='solid'>
                      Editar informações
                    </Button>
                  </CardFooter>
                </Card>
              </div>

            </div>
          </div> :
          <div className="col-span-1 bg-white shadow-lg rounded p-3 mt-4">
            <SkeletonText mt="4" noOfLines={1} skeletonHeight='300' className="w-full" />
          </div>
        }
      </div>
    </main>
  );
}