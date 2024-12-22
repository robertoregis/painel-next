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
  Avatar
} from '@chakra-ui/react';
import { ChevronRightIcon, ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';
import React, { useEffect, useState, useContext, useRef } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserContext } from "../../../context/UserContext";
import ToolsMenu from "@/app/components/ToolsMenu";
import NotData from "@/app/components/NotData";
import { showToast } from "@/app/utils/chakra";
import { removeFromLocalStorage } from "@/app/utils/localStorage";

export default function Home() {
  const [show, setShow] = React.useState<boolean>(false)
  const [logs, setLogs] = useState<any[]>([])
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter();
  const _userContext = useContext(UserContext)
  const isLoaded = useRef(false)
  const isPage = useRef(false)
  const optionsToolsMenu: any = []

  const goRouter = (href: string) => {
    router.push(href)
  }

  const getLogsFetch = async () => {
    //console.log(_userContext?.token)
    try {
      const url = new URL('https://backend-my-site.onrender.com/logs');
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
        throw new Error('Erro ao enviar requisição.');
      }

      const responseData = await response.json();
      if(responseData.status !== 0) {
        setLogs(responseData.data.logs)
        setLimit(responseData.data.limit)
        setTotal(responseData.data.total)
        setTotalPages(responseData.data.totalPages)
      }
      isPage.current = true
      setLoading(false)
      console.log('Resposta da API:', responseData);
    } catch (error) {
      console.error('Erro ao enviar requisição:', error);
    }
  };

  useEffect(() => {
    if(!isLoaded.current) {
      getLogsFetch()
      isLoaded.current = true
    }
  }, [])

  useEffect(() => {
    if(isPage.current) {
      setLoading(false)
      getLogsFetch()
    }
  }, [page])

  return (
    <main className="flex w-full p-4">
      <div className="grid grid-cols-1 w-full">

        <div className="col-span-1 bg-white shadow-lg rounded p-2">
          <div className="flex items-center justify-between">
            <Breadcrumb spacing='4px' separator={<ChevronRightIcon w={5} h={5} color='black' />}>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink color="black">Logs</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
            <div className="flex items-center">
              <ToolsMenu options={optionsToolsMenu} />
            </div>
          </div>
        </div>

        <div className="col-span-1 mt-4">
          <h1 className="mb-0 text-xl lg:text-2xl">Logs</h1>
        </div>

        <div className="col-span-1 mt-4 bg-white shadow-lg rounded p-3">
          <p className="mb-0">Confira todos os logs do sistema. Esteja por dentro do que acontece.</p>
        </div>

        {
          !loading ? 
          <div className="col-span-1 mt-4 bg-white shadow-lg rounded p-3">
            { logs.length > 0 ?
            <div className="grid grid-cols-1 mt-3">
              <div className="col-span-1">
              <Stack spacing='4'>
                  {logs.map((log: any, indice: any) => (
                      <Card key={log.id} size="sm" variant="filled" className={`${log.is_ready ? `` : `opacity-90`}`}>
                          <CardHeader paddingLeft="10px" paddingEnd="5px" paddingTop="5px" paddingRight="10px">
                              <div className="flex items-center">
                                <Avatar size="md" name={log.user ? log.user.username : ''} src={log.user ? log.user.image_url : ''} />
                                <div className="flex flex-col ml-2">
                                  <h2 className="mb-[0px] text-[1rem] md:text-[1.1rem] font-[600]">{log.user ? log.user.username : 'Sistema'}</h2>
                                  <span className="text-[0.7rem]">{log.date_formatted}</span>
                                </div>
                              </div>
                          </CardHeader>
                          <CardBody marginTop="-5px" paddingLeft="10px" paddingEnd="5px" paddingTop="5px" paddingRight="10px">
                              <div className="flex flex-col">
                              <span className="text-base md:text-lg font-[600]">{log.title}</span>
                              <span className="text-sm">{log.description}</span>
                              </div>
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
              <NotData title="Nenhum log encontrado" />
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
