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
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Stack,
  StackDivider,
  Text,
  Heading,
} from '@chakra-ui/react';
import { Link } from '@chakra-ui/next-js'
//import Link from 'next/link';
import { ChevronRightIcon, EmailIcon } from '@chakra-ui/icons';
import { MdEdit, MdLocalPolice } from "react-icons/md";
import React, { useEffect, useState, useContext } from "react";
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { UserContext } from '@/app/context/UserContext';
import ToolsMenu from '@/app/components/ToolsMenu';
import ShowImage from '@/app/components/ShowImage';
import { removeFromLocalStorage } from '@/app/utils/localStorage';
import { showToast } from '@/app/utils/chakra';

export default function Home() {
  const [show, setShow] = React.useState(false)
  const handleClick = () => setShow(!show)
  const _userContext = useContext(UserContext)
  const router = useRouter();
  const [curriculumId, setCurriculumId] = useState<any>(null)
  const [curriculum, setCurriculum] = useState<any>({})
  const toast = useToast()
  const [loading, setLoading] = useState<boolean>(true)
  const params = useParams()
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

  const getCurriculumFetch = async () => {
    try {
      const response = await fetch(`https://backend-my-site.onrender.com/curriculuns/${params.slug[0]}`, {
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
        setCurriculum(responseData.data.curriculum)
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
    setCurriculumId(params.slug[0])
    getCurriculumFetch()
  }, [])

  return (
    <main className="flex w-full p-4">
      <div className="grid grid-cols-1 w-full">
        <div className="col-span-1 bg-white shadow-lg rounded p-2">
        <div className="flex items-center justify-between">
          <Breadcrumb spacing='4px' separator={<ChevronRightIcon w={5} h={5} color='black' />}>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => goRouter('/feed/curriculos')} color="black">Currículos</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink color="black">Visualizar</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink color="black">{curriculum.name}</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          <div className="flex items-center">
            <ToolsMenu options={optionsToolsMenu} />
          </div>
        </div>
        </div>
        <div className="col-span-1 mt-4">
          <h1 className="mb-0 text-xl lg:text-2xl">{curriculum.name}</h1>
        </div>
        <div className="col-span-1 mt-4 bg-white shadow-lg rounded p-3">
          <p className="mb-0">Visualizar currículo</p>
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
                          {curriculum.name}
                        </Text>
                      </Box>
                      <Box>
                        <Heading mb={1} size='xs' textTransform='uppercase'>
                          Data de criação:
                        </Heading>
                        <Text mb={1} fontSize='sm'>
                          {curriculum.createdAt}
                        </Text>
                      </Box>
                      <Box>
                        <Heading mb={1} size='xs' textTransform='uppercase'>
                          Data de atualização:
                        </Heading>
                        <Text mb={1} fontSize='sm'>
                          {curriculum.updatedAt}
                        </Text>
                      </Box>
                    </Stack>
                  </CardBody>

                  <CardFooter paddingTop={1}>
                    <Button onClick={() => goRouter(`/feed/curriculos/editar/${curriculum.id}`)} leftIcon={<MdEdit />} colorScheme='teal' variant='solid'>
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