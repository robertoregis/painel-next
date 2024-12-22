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
  Wrap,
  WrapItem,
  Tag,
  TagLabel,
  TagLeftIcon,
} from '@chakra-ui/react';
import { Link } from '@chakra-ui/next-js'
//import Link from 'next/link';
import { ChevronRightIcon, EmailIcon } from '@chakra-ui/icons';
import { MdEdit, MdLocalPolice } from "react-icons/md";
import React, { useEffect, useState, useContext, useRef } from "react";
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { UserContext } from '@/app/context/UserContext';
import AddRoleInUser from '@/app/components/AddRoleInUser';
import ToolsMenu from '@/app/components/ToolsMenu';
import ShowImage from '@/app/components/ShowImage';
import { removeFromLocalStorage, saveToLocalStorage } from '@/app/utils/localStorage';
import { showToast } from '@/app/utils/chakra';
import NotData from '@/app/components/NotData';

export default function Home() {
  const [show, setShow] = React.useState(false)
  const handleClick = () => setShow(!show)
  const _userContext = useContext(UserContext)
  const router = useRouter();
  const [userId, setUserId] = useState<any>(null)
  const [user, setUser] = useState<any>({})
  const toast = useToast()
  const [loading, setLoading] = useState<boolean>(true)
  const params: any = useParams()
  const optionsToolsMenu: any = []
  const [logs, setLogs] = useState<any>([])
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(3);
  const isLoaded = useRef(false)
  const isPage = useRef(false)

  const goRouter = (href: string) => {
    router.push(href)
  }

  const logout = () => {
    removeFromLocalStorage('user_data_client')
    _userContext?.setToken('')
    _userContext?.setUser({})
    router.push('/login')
  }

  const changeUser = () => {
    getUserFetch()
  }

  const getUserFetch = async () => {
    try {
      const response = await fetch(`https://backend-my-site.onrender.com/users/${params.slug[0]}`, {
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
        getLogsFetch(responseData.data.user.id)
        setUser(responseData.data.user)
        if(responseData.data.user.id === _userContext?.user.id) {
          _userContext?.setUser(responseData.data.user)
          //
          let newPermissions: any = []
          responseData.data.user.roles.forEach((role: any) => {
              role.permissions.forEach((permission: any) => {
                  if(!newPermissions.includes(permission.value)) {
                      newPermissions.push(permission.value)
                  }
              })
          })
          if(newPermissions.includes('all')) {
              newPermissions = ['all']
          }
          _userContext?.setPermissions(newPermissions)
          //
          const storage = {
            user: responseData.data.user,
            token: _userContext?.token,
            data: new Date()
          }
          saveToLocalStorage('user_data_client', storage)
        }
      } else {
        showToast({
          description: responseData.message,
          status: 'error'
        }, toast);
      }
      //console.log('Resposta da API - visualizar usuário:', responseData);
      //setLoading(false)
    } catch (error) {
      console.error('Request Error: An issue occurred', error);
      showToast({
        title: 'Request Error: An issue occurred',
        status: 'error'
      }, toast);
    }
  };

  const getLogsFetch = async (userId: string) => {
    try {
      const url = new URL('https://backend-my-site.onrender.com/logs');
      url.searchParams.append('page', String(page));
      url.searchParams.append('limit', String(limit));
      url.searchParams.append('userId', String(userId));
      const response = await fetch(url, {
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
        setLogs(responseData.data.logs)
      }
      setLoading(false)
      //console.log('Resposta da API:', responseData);
    } catch (error) {
      console.error('Erro ao enviar requisição:', error);
    }
  };

  useEffect(() => {
    setUserId(params.slug[0])
    getUserFetch()
  }, [])

  return (
    <main className="flex w-full p-4">
      <div className="grid grid-cols-1 w-full">
        <div className="col-span-1 bg-white shadow-lg rounded p-2">
        <div className="flex items-center justify-between">
          <Breadcrumb spacing='4px' separator={<ChevronRightIcon w={5} h={5} color='black' />}>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => goRouter('/feed/usuarios')} color="black">Usuarios</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink color="black">Visualizar</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink color="black">{user.username}</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          <div className="flex items-center">
            <ToolsMenu options={optionsToolsMenu} />
          </div>
        </div>
        </div>
        <div className="col-span-1 mt-4">
          <h1 className="mb-0 text-xl lg:text-2xl">{user.username}</h1>
        </div>
        <div className="col-span-1 mt-4 bg-white shadow-lg rounded p-3">
          <p className="mb-0">Visualizar usuário</p>
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
                      {
                        user.imageUrl && (
                          <>
                          <Box>
                            <ShowImage img={user.imageUrl} />
                          </Box>
                          </>
                        )
                      }
                      <Box>
                        <Heading mb={1} size='xs' textTransform='uppercase'>
                          Nome:
                        </Heading>
                        <Text mb={1} fontSize='sm'>
                          {user.username}
                        </Text>
                      </Box>
                      <Box>
                        <Heading mb={1} size='xs' textTransform='uppercase'>
                          E-mail:
                        </Heading>
                        <Text mb={1} fontSize='sm'>
                          {user.email}
                        </Text>
                      </Box>
                      <Box>
                        <Heading mb={1} size='xs' textTransform='uppercase'>
                          Cidade:
                        </Heading>
                        <Text mb={1} fontSize='sm'>
                          {user.city}
                        </Text>
                      </Box>
                      <Box>
                        <Heading mb={1} size='xs' textTransform='uppercase'>
                          Estado:
                        </Heading>
                        <Text mb={1} fontSize='sm'>
                          {user.state}
                        </Text>
                      </Box>
                      <Box>
                        <Heading mb={1} size='xs' textTransform='uppercase'>
                          Data de criação:
                        </Heading>
                        <Text mb={1} fontSize='sm'>
                          {user.createdAt}
                        </Text>
                      </Box>
                      <Box>
                        <Heading mb={1} size='xs' textTransform='uppercase'>
                          Data de atualização:
                        </Heading>
                        <Text mb={1} fontSize='sm'>
                          {user.updatedAt}
                        </Text>
                      </Box>
                    </Stack>
                  </CardBody>

                  <CardFooter paddingTop={1}>
                    <Button onClick={() => goRouter(`/feed/usuarios/editar/${user.id}`)} leftIcon={<MdEdit />} colorScheme='teal' variant='solid'>
                      Editar informações
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <div className="col-span-1 bg-white shadow-lg rounded p-2 mt-4">
              <Card boxShadow="none" border="none">
                  <CardHeader>
                    <Heading size='md'>Permissões:</Heading>
                  </CardHeader>

                  <CardBody paddingTop={1}>
                    {user.roles.length > 0 ? (
                      <Wrap spacing={3}>
                        {user.roles.map((role: any) => (
                          <WrapItem key={role.id}>
                            <Tag size="lg" variant='subtle' color='white' bg='gray.600' borderRadius='full'>
                              <TagLeftIcon boxSize='17px' as={MdLocalPolice} />
                              <TagLabel>{role.name}</TagLabel>
                            </Tag>
                          </WrapItem>
                        ))}
                      </Wrap>
                    ) : (
                      <span className='bg-neutral-200 px-4 py-1 rounded font-[500]'>Não tem permissões</span>
                    )}
                  </CardBody>

                  <CardFooter paddingTop={1}>
                    <AddRoleInUser user={user} isEdit={true} changeUser={changeUser} />
                  </CardFooter>
                </Card>
              </div>

              <div className="col-span-1 bg-white shadow-lg p-3 mt-4">
                <div className="grid grid-cols-1">
                  <div className="col-span-1">
                    <h2 className="text-lg font-[600]">Histórico de atividades:</h2>
                  </div>
                  {
                    logs.length > 0 ?
                    <div className="col-span-1 mt-3">
                    <Stack spacing='3'>
                      {logs.map((log: any) => (
                          <Card key={log.id} size="sm" bg="gray.200" color="black">
                              <CardHeader paddingBottom={1}>
                                  <div className="flex items-center">
                                  <Avatar size="md" name={log.user.username} src={log.user.image_url} />
                                    <div className="flex flex-col ml-3">
                                    <Heading size='sm'>{log.title}</Heading>
                                    <span className="text-[0.7rem]">{log.date_formatted}</span>
                                    </div>
                                  </div>
                              </CardHeader>
                              <CardBody paddingTop={1}>
                                  <span className='text-[0.9rem]'>{log.description}</span>
                              </CardBody>
                          </Card>
                      ))}
                    </Stack>
                    </div>
                    : <>
                      <NotData title="Nenhuma atividade encontrada" />
                    </>
                  }
                </div>
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