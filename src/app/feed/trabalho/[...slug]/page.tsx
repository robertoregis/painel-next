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
import { FaDeleteLeft } from "react-icons/fa6";
import { removeFromLocalStorage } from '@/app/utils/localStorage';
import { showToast } from '@/app/utils/chakra';
import { ModalContext } from '@/app/context/ModalContext';
import CropImage from "@/app/components/CropImage";

export default function Home() {
  const [show, setShow] = React.useState(false)
  const handleClick = () => setShow(!show)
  const _userContext = useContext(UserContext);
  const _modalContext = useContext(ModalContext);
  const router = useRouter();
  const [jobId, setJobId] = useState<any>(null)
  const [job, setJob] = useState<any>({})
  const toast = useToast()
  const [loading, setLoading] = useState<boolean>(true)
  const params: any = useParams()
  const optionsToolsMenu: any = []
  const [imageSrc, setImageSrc] = useState('');
  const [isImage, setIsImage] = useState<boolean>(false)
  const [aspect, setAspect] = useState(16 / 9); // Valor padrão
  const [file, setFile] = useState<any>(null)

  const goRouter = (href: string) => {
    router.push(href)
  }

  const logout = () => {
    removeFromLocalStorage('user_data_client')
    _userContext?.setToken('')
    _userContext?.setUser({})
    router.push('/login')
  }

  const getData = (img: any) => {
    setFile(img.file);
    setIsImage(true)
    updateGallery(img.file)
	}

  const updateGallery = async (fileInput: any) => {
    if (!fileInput) {
      toast({
        title: 'Não foi possível criar!',
        description: 'É preciso escolher uma imagem',
        status: 'error',
        position: 'bottom-right',
        isClosable: true,
      });
      _modalContext.onCloseLoading();
      return;
    }
    try {
      _modalContext.onOpenLoading();
      const formData = new FormData();
      // Itera sobre os arquivos e os adiciona individualmente ao FormData
      formData.append('file', fileInput);

      const response = await fetch(`https://backend-my-site.onrender.com/jobs/${params.slug[0]}/add-in-gallery`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${_userContext?.token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const responseData = await response.json();
        if (responseData.error === "Unauthorized") {
          setFile(null);
          setIsImage(false)
          _modalContext.onCloseLoading();
          showToast({
            title: 'Erro de autenticação',
            description: 'Você será deslogado',
            status: 'error'
          }, toast);
          logout();
          return;
        }
      }

      const responseData = await response.json();
      if(responseData.status !== 0) {
        showToast({
          description: responseData.message,
          status: 'success'
        }, toast);
        setFile(null);
        setIsImage(false)
        getJobFetch();
      } else {
        showToast({
          description: responseData.message,
          status: 'error'
        }, toast);
      }

      _modalContext.onCloseLoading();
    } catch (error) {
      setFile(null);
      setIsImage(false)
      _modalContext.onCloseLoading();
      console.error('Request Error: An issue occurred', error);
      showToast({
        title: 'Request Error: An issue occurred',
        status: 'error'
      }, toast);
    }
  };

  const removeImageGallery = async (imageId: string) => {
    try {
      _modalContext.onOpenLoading();
      const response = await fetch(`https://backend-my-site.onrender.com/jobs/${params.slug[0]}/remove-image-in-gallery`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${_userContext?.token}`,
        },
        body: JSON.stringify({ imageId }),
      });

      if (!response.ok) {
        const responseData = await response.json();
        if (responseData.error === "Unauthorized") {
          setFile(null);
          setIsImage(false)
          _modalContext.onCloseLoading();
          showToast({
            title: 'Erro de autenticação',
            description: 'Você será deslogado',
            status: 'error'
          }, toast);
          logout();
          return;
        }
      }
      const responseData = await response.json();
      if(responseData.status !== 0) {
        showToast({
          description: responseData.message,
          status: 'success'
        }, toast);
        getJobFetch();
      } else {
        showToast({
          description: responseData.message,
          status: 'error'
        }, toast);
      }
      _modalContext.onCloseLoading();
    } catch (error) {
      _modalContext.onCloseLoading();
      console.error('Request Error: An issue occurred', error);
      showToast({
        title: 'Request Error: An issue occurred',
        status: 'error'
      }, toast);
    }
  };

  const getJobFetch = async () => {
    try {
      const response = await fetch(`https://backend-my-site.onrender.com/jobs/${params.slug[0]}`, {
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
        setJob(responseData.data.job)
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
    setJobId(params.slug[0])
    getJobFetch()
  }, [])

  return (
    <main className="flex w-full p-4">
      <div className="grid grid-cols-1 w-full">
        <div className="col-span-1 bg-white shadow-lg rounded p-2">
        <div className="flex items-center justify-between">
          <Breadcrumb spacing='4px' separator={<ChevronRightIcon w={5} h={5} color='black' />}>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => goRouter('/feed/trabalhos')} color="black">Trabalhos</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink color="black">Visualizar</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink color="black">{job.name}</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          <div className="flex items-center">
            <ToolsMenu options={optionsToolsMenu} />
          </div>
        </div>
        </div>
        <div className="col-span-1 mt-4">
          <h1 className="mb-0 text-xl lg:text-2xl">{job.name}</h1>
        </div>
        <div className="col-span-1 mt-4 bg-white shadow-lg rounded p-3">
          <p className="mb-0">Visualizar trabalho</p>
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
                          job.imageUrl ? <ShowImage img={job.imageUrl} /> : <Text mb={1} fontSize='sm'>Sem imagem</Text>
                        }
                      </Box>
                      <Box>
                        <Heading mb={1} size='xs' textTransform='uppercase'>
                          Nome:
                        </Heading>
                        <Text mb={1} fontSize='sm'>
                          {job.name}
                        </Text>
                      </Box>
                      <Box>
                        <Heading mb={1} size='xs' textTransform='uppercase'>
                          Data de criação:
                        </Heading>
                        <Text mb={1} fontSize='sm'>
                          {job.createdAt}
                        </Text>
                      </Box>
                      <Box>
                        <Heading mb={1} size='xs' textTransform='uppercase'>
                          Data de atualização:
                        </Heading>
                        <Text mb={1} fontSize='sm'>
                          {job.updatedAt}
                        </Text>
                      </Box>
                    </Stack>
                  </CardBody>

                  <CardFooter paddingTop={1}>
                    <Button onClick={() => goRouter(`/feed/linguagens/editar/${job.id}`)} leftIcon={<MdEdit />} colorScheme='teal' variant='solid'>
                      Editar informações
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <div className="col-span-1 bg-white shadow-lg rounded p-2 mt-4">
              <Card boxShadow="none" border="none">
                  <CardHeader>
                    <Heading size='md'>Galeria:</Heading>
                  </CardHeader>

                  <CardBody paddingTop={0}>
                    <div className="grid grid-cols-1 mb-4">
                      <div className="col-span-1">
                        <CropImage getData={getData} aspect={aspect} titleButton={`Escolher imagem`} imageInitial={imageSrc} isImage={isImage} />
                      </div>
                    </div>
                    { job.gallery && job.gallery.length ? 
                      <Stack divider={<StackDivider />} spacing='2' direction="row">
                        {
                          job.gallery.map((file: any, index: any) => (
                            <Box key={index} className='relative'>
                              <button onClick={() => removeImageGallery(file.image_id)} className="bg-red-800 text-white absolute -top-2 -right-2 rounded w-[25px] h-[25px] flex justify-center items-center">
                                <FaDeleteLeft />
                              </button>
                              <ShowImage img={file.image_url} isBig={true} />
                            </Box>
                          ))
                        }
                      </Stack>
                      : <div><span>Não há imagens</span></div>
                    }
                  </CardBody>
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