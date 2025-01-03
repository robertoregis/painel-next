'use client'
import Image from "next/image";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Card,
  CardBody,
  Box,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Popover,
  PopoverTrigger,
  PopoverBody,
  PopoverContent,
  IconButton,
  Tooltip,
  Avatar,
  Wrap,
  useToast
} from '@chakra-ui/react';
import { ChevronRightIcon, ArrowLeftIcon, ArrowRightIcon, DeleteIcon } from '@chakra-ui/icons';
import React, { useEffect, useState, useContext, useRef } from "react";
import { useRouter } from 'next/navigation';
import { UserContext } from "@/app/context/UserContext";
import ToolsMenu from "@/app/components/ToolsMenu";
import NotData from "@/app/components/NotData";
import { IoEnter } from "react-icons/io5";
import { MdModeEdit } from "react-icons/md";
import { showToast } from "@/app/utils/chakra";
import { removeFromLocalStorage } from "@/app/utils/localStorage";
import { ModalContext } from "@/app/context/ModalContext";

export default function Home() {
  const [curriculuns, setCurriculuns] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter();
  const _userContext = useContext(UserContext);
  const _modalContext = useContext(ModalContext);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
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

  const getCurriculunsFetch = async () => {
    try {
      const url = new URL('https://backend-my-site.onrender.com/curriculuns');
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
        setCurriculuns(responseData.data.curriculuns)
        setLimit(responseData.data.limit)
        setTotal(responseData.data.total)
        setTotalPages(responseData.data.totalPages)
      }
      setLoading(false)
      //console.log('Resposta da API:', responseData);
    } catch (error) {
      console.error('Erro ao enviar requisição:', error);
    }
  };

  const removeCurriculumFetch = async (curriculumId: string) => {
    try {
      _modalContext.onOpenLoading()
      const response = await fetch(`https://backend-my-site.onrender.com/curriculuns/${curriculumId}`, {
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
        getCurriculunsFetch()
        _modalContext.onCloseLoading()
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

  const editCurriculum = (curriculumId: string) => {
    router.push(`/feed/curriculos/editar/${curriculumId}`)
  }

  const showCurriculum = (href: string) => {
    router.push(href)
  }

  useEffect(() => {
    if(!isLoaded.current) {
      getCurriculunsFetch()
      isLoaded.current = true
    }
  }, [])

  useEffect(() => {
    if(isPage.current) {
      setLoading(false)
      getCurriculunsFetch()
    }
  }, [page])

  return (
    <main className="flex w-full p-4">
      <div className="grid grid-cols-1 w-full">

        <div className="col-span-1 bg-white shadow-lg rounded p-2">
          <div className="flex items-center justify-between">
            <Breadcrumb spacing='4px' separator={<ChevronRightIcon w={5} h={5} color='black' />}>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink color="black">Currículos</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
            <div className="flex items-center">
              <ToolsMenu options={optionsToolsMenu} />
            </div>
          </div>
        </div>

        <div className="col-span-1 mt-4">
          <h1 className="mb-0 text-xl lg:text-2xl">Currículos</h1>
        </div>

        <div className="col-span-1 mt-4 bg-white shadow-lg rounded p-3">
          <div className="flex">
            <Button onClick={() => goRouter('/feed/curriculos/criar')} colorScheme="green">
              Criar currículo
            </Button>
          </div>
        </div>

        {
          !loading ?  
          <div className="col-span-1 mt-4 bg-white shadow-lg rounded p-3">
            { curriculuns.length > 0 ?
            <div className="grid grid-cols-1">
              <div className="col-span-1">
                <div className="grid grid-cols-1 gap-3">
                  {curriculuns.map((curriculum: any, index: any) => (
                    <div key={index} className="col-span-1">
                      <Card size="sm" bgColor="blackAlpha.100" role="dialog" tabIndex={0} cursor="pointer">
                      <Popover placement='bottom-start'>
                        <PopoverTrigger>
                          <CardBody padding="8px">
                            <span className="">{curriculum.name}</span>
                          </CardBody>
                        </PopoverTrigger>
                        <PopoverContent maxW="180px">
                          <PopoverBody className="flex justify-center">
                            <Wrap>
                              <Tooltip label="Visualizar">
                              <IconButton
                                onClick={() => showCurriculum(curriculum.uri)}
                                aria-label='Visualizar permissão'
                                icon={<IoEnter />}
                              />
                              </Tooltip>
                              <Tooltip label="Excluir">
                              <IconButton
                                onClick={() => removeCurriculumFetch(curriculum.id)}
                                aria-label='Excluir permissão'
                                icon={<DeleteIcon />}
                              />
                              </Tooltip>
                              <Tooltip label="Editar">
                              <IconButton
                                onClick={() => editCurriculum(curriculum.id)}
                                aria-label='Editar permissão'
                                icon={<MdModeEdit />}
                              />
                              </Tooltip>
                            </Wrap>
                          </PopoverBody>
                        </PopoverContent>
                      </Popover>
                      </Card>
                    </div>
                  ))}
                </div>
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
              <NotData title="Nenhum currículo encontrado" />
            </>
            }      
          </div>
          : <>
          <div className="col-span-1 bg-white shadow-lg rounded p-3 mt-4">
            <SkeletonText mt="4" noOfLines={1} skeletonHeight='40' className="w-full" />
          </div>
          </>
        }

      </div>
    </main>
  );
}
