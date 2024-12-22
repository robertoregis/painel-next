'use client'
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
  Image,
  useToast,
  Popover,
  PopoverTrigger,
  PopoverBody,
  PopoverContent,
  IconButton,
  Tooltip,
  Avatar,
  Wrap,
} from '@chakra-ui/react';
import { ChevronRightIcon, ArrowLeftIcon, ArrowRightIcon, DeleteIcon } from '@chakra-ui/icons';
import React, { useEffect, useState, useContext, useRef } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserContext } from "../../context/UserContext";
import { textSlice } from "@/app/utils/textFormatters";
import { showToast } from '@/app/utils/chakra';
import { removeFromLocalStorage } from '@/app/utils/localStorage';
import ToolsMenu from '@/app/components/ToolsMenu';
import NotData from '@/app/components/NotData';
import { IoEnter } from "react-icons/io5";
import { MdModeEdit } from "react-icons/md";
import { ModalContext } from '@/app/context/ModalContext';

export default function Home() {
  const [show, setShow] = React.useState<boolean>(false)
  const [posts, setPosts] = useState<any[]>([])
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter();
  const _userContext = useContext(UserContext);
  const _modalContext = useContext(ModalContext);
  const isLoaded = useRef(false)
  const isPage = useRef(false)
  const toast = useToast()

  const optionsToolsMenu: any = [
    /*{
      type: 'link',
      link: '/feed/usuarios'
    },
    {
      type: 'function',
      commit: () => {
        alert('ldldld')
      }
    }*/
  ]

  const goRouter = (href: string) => {
    router.push(href)
  }

  const logout = () => {
    removeFromLocalStorage('user_data_client')
    _userContext?.setToken('')
    _userContext?.setUser({})
    router.push('/login')
  }

  const getPostsFetch = async () => {
    try {
      const response = await fetch('https://backend-my-site.onrender.com/posts', {
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
         setPosts(responseData.data.posts)
      }
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

  const removePostFetch = async (postId: string) => {
    try {
      _modalContext.onOpenLoading()
      const response = await fetch(`https://backend-my-site.onrender.com/posts/${postId}`, {
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
        getPostsFetch()
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

  const editPost = (postId: string) => {
    router.push(`/feed/publicacoes/editar/${postId}`)
  }

  const showPost = (href: string) => {
    router.push(href)
  }

  useEffect(() => {
    if(!isLoaded.current) {
      //console.log(_userContext?.user)
      getPostsFetch()
      isLoaded.current = true
    }
  }, [])

  useEffect(() => {
    if(isPage.current) {
      setLoading(false)
      getPostsFetch()
    }
  }, [page])

  return (
    <main className="flex w-full p-4">
      <div className="grid grid-cols-1 w-full">

        <div className="col-span-1 bg-white shadow-lg rounded p-2">
          <div className="flex items-center justify-between">
            <Breadcrumb spacing='4px' separator={<ChevronRightIcon w={5} h={5} color='black' />}>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink color="black">Publicações</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
            <div className="flex items-center">
              <ToolsMenu options={optionsToolsMenu} />
            </div>
          </div>
        </div>

        <div className="col-span-1 mt-4">
          <h1 className="mb-0 text-xl lg:text-2xl">Publicações</h1>
        </div>

        <div className="col-span-1 mt-4 bg-white shadow-lg rounded p-3">
          <div className="flex">
            <Button onClick={() => goRouter('/feed/publicacoes/criar')} colorScheme="green">
              Criar publicação
            </Button>
          </div>
        </div>

        {
          loading ?  
          <div className="col-span-1 mt-4 bg-white shadow-lg rounded p-3">
            { posts.length > 0 ?
            <div className="grid grid-cols-1 mt-3">
              <div className="col-span-1">
              <Stack spacing='4'>
                  {posts.map((post: any, indice: any) => (
                      
                        <Popover key={post.id} placement='bottom-start'>
                          <PopoverTrigger>
                            <Card size="sm" role="dialog" tabIndex={0} cursor="pointer">
                              <CardHeader paddingLeft="10px" paddingEnd="5px" paddingTop="5px" paddingRight="10px">
                                <div className="flex items-center">
                                <Image
                                  boxSize='80px'
                                  objectFit='cover'
                                  src={post.image_url}
                                  alt={post.title}
                                  borderRadius="10px"
                                />
                                <h2 className="mb-[0px] text-lg font-[600] ml-2">{post.title}</h2>
                                </div>
                            </CardHeader>
                            <CardBody marginTop="-5px" paddingLeft="10px" paddingEnd="5px" paddingTop="5px" paddingRight="10px">
                                <span className="text-sm">{textSlice(post.description, 180)}</span>
                            </CardBody>
                            </Card>
                          </PopoverTrigger>
                          <PopoverContent maxW="180px">
                            <PopoverBody className="flex justify-center">
                              <Wrap>
                                <Tooltip label="Visualizar">
                                <IconButton
                                  onClick={() => showPost(post.uri)}
                                  aria-label='Visualizar publicação'
                                  icon={<IoEnter />}
                                />
                                </Tooltip>
                                <Tooltip label="Excluir">
                                <IconButton
                                  onClick={() => removePostFetch(post.id)}
                                  aria-label='Excluir publicação'
                                  icon={<DeleteIcon />}
                                />
                                </Tooltip>
                                <Tooltip label="Editar">
                                <IconButton
                                  onClick={() => editPost(post.id)}
                                  aria-label='Editar publicação'
                                  icon={<MdModeEdit />}
                                />
                                </Tooltip>
                              </Wrap>
                            </PopoverBody>
                          </PopoverContent>
                        </Popover>
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
              <NotData title="Nenhuma publicação encontrada" />
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
