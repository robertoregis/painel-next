'use client'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  useToast,
  SkeletonText,
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
import { ChevronRightIcon } from '@chakra-ui/icons';
import { MdEdit } from "react-icons/md";
import React, { useEffect, useState, useContext } from "react";
import { useRouter, useParams } from 'next/navigation';
import { UserContext } from '@/app/context/UserContext';
import ToolsMenu from '@/app/components/ToolsMenu';
import ShowImage from '@/app/components/ShowImage';
import { removeFromLocalStorage } from '@/app/utils/localStorage';
import { showToast } from '@/app/utils/chakra';
import { ModalContext } from '@/app/context/ModalContext';

export default function Home() {
  const [show, setShow] = React.useState(false)
  const _userContext = useContext(UserContext);
  //const _modalContext = useContext(ModalContext);
  const router = useRouter();
  const [languageId, setLanguageId] = useState<any>(null)
  const [language, setLanguage] = useState<any>({})
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

  const getLanguageFetch = async () => {
    try {
      const response = await fetch(`https://backend-my-site.onrender.com/languagens/${params.slug[0]}`, {
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
        setLanguage(responseData.data.language)
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
    setLanguageId(params.slug[0])
    getLanguageFetch()
  }, [])

  return (
    <main className="flex w-full p-4">
      <div className="grid grid-cols-1 w-full">
        <div className="col-span-1 bg-white shadow-lg rounded p-2">
        <div className="flex items-center justify-between">
          <Breadcrumb spacing='4px' separator={<ChevronRightIcon w={5} h={5} color='black' />}>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => goRouter('/feed/linguagens')} color="black">Linguagens</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink color="black">Visualizar</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink color="black">{language.name}</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          <div className="flex items-center">
            <ToolsMenu options={optionsToolsMenu} />
          </div>
        </div>
        </div>
        <div className="col-span-1 mt-4">
          <h1 className="mb-0 text-xl lg:text-2xl">{language.name}</h1>
        </div>
        <div className="col-span-1 mt-4 bg-white shadow-lg rounded p-3">
          <p className="mb-0">Visualizar linguagem</p>
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
                          Imagem:
                        </Heading>
                        {
                          language.imageUrl ? <ShowImage img={language.imageUrl} /> : <Text mb={1} fontSize='sm'>Sem imagem</Text>
                        }
                      </Box>
                      <Box>
                        <Heading mb={1} size='xs' textTransform='uppercase'>
                          Nome:
                        </Heading>
                        <Text mb={1} fontSize='sm'>
                          {language.name}
                        </Text>
                      </Box>
                      <Box>
                        <Heading mb={1} size='xs' textTransform='uppercase'>
                          Data de criação:
                        </Heading>
                        <Text mb={1} fontSize='sm'>
                          {language.createdAt}
                        </Text>
                      </Box>
                      <Box>
                        <Heading mb={1} size='xs' textTransform='uppercase'>
                          Data de atualização:
                        </Heading>
                        <Text mb={1} fontSize='sm'>
                          {language.updatedAt}
                        </Text>
                      </Box>
                    </Stack>
                  </CardBody>

                  <CardFooter paddingTop={1}>
                    <Button onClick={() => goRouter(`/feed/linguagens/editar/${language.id}`)} leftIcon={<MdEdit />} colorScheme='teal' variant='solid'>
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