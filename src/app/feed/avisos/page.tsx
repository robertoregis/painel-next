'use client'
import Image from "next/image";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Stack,
  Heading,
  Box,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  useToast
} from '@chakra-ui/react';
import { ChevronRightIcon, ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';
import React, { useEffect, useState, useContext, useRef } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserContext } from "../../context/UserContext";
import ToolsMenu from "@/app/components/ToolsMenu";
import { showToast } from "@/app/utils/chakra";
import { removeFromLocalStorage } from "@/app/utils/localStorage";
import NotData from "@/app/components/NotData";

export default function Home() {
  const [show, setShow] = React.useState<boolean>(false)
  const [warnings, setWarnings] = useState<any[]>([])
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter();
  const _userContext = useContext(UserContext)
  const isLoaded = useRef(false)
  const isPage = useRef(false)
  const toast = useToast()

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

  const getWarningsFetch = async () => {
    //console.log(_userContext?.token)
    try {
      const url = new URL('https://backend-my-site.onrender.com/warnings');
      url.searchParams.append('page', String(page));
      url.searchParams.append('limit', String(limit));
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
         setWarnings(responseData.data.warnings)
         setLimit(responseData.data.limit)
         setTotal(responseData.data.total)
         setTotalPages(responseData.data.totalPages)
         let warningsId: any = []
         responseData.data.warnings.forEach((warning: any) => {
          if(!warning.is_ready) {
            warningsId.push(warning.id)
          }
         })
         if(warningsId.length) {
          updateWarningsIsReady(warningsId)
         }
      }
      isPage.current = true
      setLoading(true)
      //console.log('Resposta da API:', responseData);
    } catch (error) {
      console.error('Request Error: An issue occurred', error);
      showToast({
        title: 'Request Error: An issue occurred',
        status: 'error'
      }, toast);
    }
  };

  const updateWarningsIsReady = async (warningsId: any[]) => {
    let data = {
      warningsId: warningsId
    }
    try {
      const response = await fetch('https://backend-my-site.onrender.com/warnings/update-is-ready', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json', // Tipo de conteúdo que você está enviando
          'Authorization': `Bearer ${_userContext?.token}`,
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Erro ao enviar requisição.');
      }

      //const responseData = await response.json();
    } catch (error) {
      console.error('Request Error: An issue occurred', error);
      showToast({
        title: 'Request Error: An issue occurred',
        status: 'error'
      }, toast);
    }
  }

  useEffect(() => {
    if(!isLoaded.current) {
      getWarningsFetch()
      isLoaded.current = true
    }
  }, [])

  useEffect(() => {
    if(isPage.current) {
      setLoading(false)
      getWarningsFetch()
    }
  }, [page])

  return (
    <main className="flex w-full p-4">
      <div className="grid grid-cols-1 w-full">

        <div className="col-span-1 bg-white shadow-lg rounded p-2">
          <div className="flex items-center justify-between">
            <Breadcrumb spacing='4px' separator={<ChevronRightIcon w={5} h={5} color='black' />}>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink color="black">Avisos</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
            <div className="flex items-center">
              <ToolsMenu options={optionsToolsMenu} />
            </div>
          </div>
        </div>

        <div className="col-span-1 mt-4">
          <h1 className="mb-0 text-xl lg:text-2xl">Avisos</h1>
        </div>

        <div className="col-span-1 mt-4 bg-white shadow-lg rounded p-3">
          {/*<p className="mb-0">Opções</p>
          <div className="flex mt-3">
            <Button onClick={() => goRouter('/feed')} colorScheme="green">
              Criar
            </Button>
          </div>*/}
          <p className="mb-0">Confira todos os avisos desde um mês atrás. Os avisos recentes possuem uma opacidade um pouco ofuscada</p>
        </div>

        {
          loading ?  
          <div className="col-span-1 mt-4 bg-white shadow-lg rounded p-3">
            { warnings.length > 0 ?
            <div className="grid grid-cols-1 mt-3">
              <div className="col-span-1">
              <Stack spacing='4'>
                  {warnings.map((warning: any, indice: any) => (
                      <Card key={warning.id} size="sm" variant="filled" className={`${warning.is_ready ? `` : `opacity-90`}`}>
                          <CardHeader paddingLeft="10px" paddingEnd="5px" paddingTop="5px" paddingRight="10px">
                              <h2 className="mb-[0px] text-lg font-[600]">{warning.title}</h2>
                              <span className="text-[0.75rem]">{warning.date_formatted}</span>
                          </CardHeader>
                          <CardBody marginTop="-5px" paddingLeft="10px" paddingEnd="5px" paddingTop="5px" paddingRight="10px">
                              <span className="text-sm">{warning.description}</span>
                          </CardBody>
                      </Card>
                  ))}
              </Stack>
              </div>
                
              {
                totalPages > 1 && 
                <div className="col-span-1 mt-5">
                  <div className="flex items-center justify-center">
                  <Box onClick={() => setPage(Number(page) - 1)} as='button' disabled={page > 1 ? false : true} borderRadius='md' className={`${page > 1 ? 'opacity-100' : 'opacity-50'} bg-neutral-200 mx-1`} px={2} py={1} w={10}>
                    <ArrowLeftIcon />
                  </Box>
                  {
                    Array.from({ length: totalPages }).map((_, index: any) => (
                      index < 4 && (
                        <Box
                          key={index} // Adicionei a prop `key` para evitar avisos de chave única
                          onClick={() => setPage(index + 1)}
                          as='button'
                          borderRadius='md'
                          className={`${page === index + 1 ? 'bg-teal-700 text-white' : 'bg-neutral-200'} mx-1`}
                          px={2}
                          py={1}
                          w={10}
                        >
                          {index + 1}
                        </Box>
                      )
                    ))
                  }
                  {totalPages > 5 && (totalPages - page >= 2) && (
                    <>
                      <Box className="mx-1">
                        ...
                      </Box>
                      <Box
                        onClick={() => setPage(totalPages)}
                        as='button'
                        borderRadius='md'
                        className={`${page === totalPages ? 'bg-teal-700 text-white' : 'bg-neutral-200'} mx-1`}
                        px={2}
                        py={1}
                        w={10}
                      >
                        {totalPages}
                      </Box>
                    </>
                  )}
                  <Box onClick={() => setPage(Number(page) + 1)} as='button' disabled={totalPages > page ? false : true} borderRadius='md' className={`${totalPages > page ? 'opacity-100' : 'opacity-50'} bg-neutral-200 mx-1`} px={2} py={1} w={10}>
                    <ArrowRightIcon />
                  </Box>
                  </div>
                </div>
              }
            </div>
            : <>
              <NotData title="Nenhum aviso encontrado" />
            </> }
          </div>
          : <>
          <div className="col-span-1 bg-white shadow-lg rounded p-3 mt-4">
            <SkeletonText mt="4" noOfLines={1} skeletonHeight='120' className="w-full" />
          </div>
          </>
        }

      </div>
    </main>
  );
}
