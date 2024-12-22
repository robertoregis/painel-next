'use client'
import Image from "next/image";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Link,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  useToast,
} from '@chakra-ui/react';
import React, { useEffect, useState, useContext } from "react";
import { ChevronRightIcon } from '@chakra-ui/icons';
//import InputMask from 'react-input-mask';
import { useRouter, useParams } from 'next/navigation';
import { UserContext } from "@/app/context/UserContext";
import ToolsMenu from "@/app/components/ToolsMenu";
import { showToast } from "@/app/utils/chakra";
import { removeFromLocalStorage } from "@/app/utils/localStorage";
import { ModalContext } from "@/app/context/ModalContext";
import CropImage from "@/app/components/CropImage";
import ShowImage from "@/app/components/ShowImage";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [jobModel, setJobModel] = useState<any>({
    name: '',
    type: '',
    userId: null
  })
  const router = useRouter();
  const params: any = useParams();
  const [loading, setLoading] = useState(true)
  const [firstFetch, setFirstFetch] = useState(false)
  const [isCreating, setIsCreating] = useState<boolean>(false)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const toast = useToast()
  const [show, setShow] = React.useState(false)
  const [imageSrc, setImageSrc] = useState('');
  const [isImage, setIsImage] = useState<boolean>(false)
  const [aspect, setAspect] = useState(16 / 9); // Valor padrão
  const [file, setFile] = useState<any>()
  const [files, setFiles] = useState<any[]>([])
  const _userContext = useContext(UserContext);
  const _modalContext = useContext(ModalContext)
  const optionsToolsMenu: any = []

  let handleTypeChange = (e: any) => {
    let inputValue = e.target.value
    setJobModel((prevState: any) => ({
      ...prevState,
      type: inputValue
    }));
  }
  let handleNameChange = (e: any) => {
    let inputValue = e.target.value
    setJobModel((prevState: any) => ({
      ...prevState,
      name: inputValue
    }));
  }

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
    setImageSrc(img.url)
    setFile(img.file)
    setIsImage(true)
	}

  const createJobFetch = async () => {
    if(!file) {
      toast({
        title: 'Não foi possível criar!',
        description: 'É preciso escolher uma imagem',
        status: 'error',
        position: 'bottom-right',
        isClosable: true,
      })
      return
    }
    try {
      _modalContext.onOpenLoading()
      setJobModel((prevState: any) => ({
        ...prevState,
        userId: _userContext?.user.id
      }));
      // Cria um objeto FormData para enviar os dados
      const formData = new FormData();
      // Adiciona o arquivo ao FormData com o nome 'file'
      formData.append('file', file);
      formData.append('name', jobModel.name);
      formData.append('type', jobModel.type);
      formData.append('userId', jobModel.userId);
      const response = await fetch('https://backend-my-site.onrender.com/jobs', {
        method: 'POST',
        headers: {
          //'Content-Type': 'application/json', // Tipo de conteúdo que você está enviando
          'Authorization': `Bearer ${_userContext?.token}`,
        },
        body: formData,
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
        router.push('/feed/trabalhos');
      } else {
        showToast({
          description: responseData.message,
          status: 'error'
        }, toast);
      }
      _modalContext.onCloseLoading()
      setIsCreating(false)
    } catch (error) {
      _modalContext.onCloseLoading()
      setIsCreating(false)
      console.error('Request Error: An issue occurred', error);
      showToast({
        title: 'Request Error: An issue occurred',
        status: 'error'
      }, toast);
    }
  };

  const getJobFetch = async () => {
    try {
      const response = await fetch(`https://backend-my-site.onrender.com/jobs/${params.slug[1]}`, {
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
        if(responseData.data.framework.imageUrl) {
          setImageSrc(responseData.data.language.imageUrl)
          setIsImage(true)
        }
        setJobModel(responseData.data.job)
      }
      //console.log('Resposta da API:', responseData);
      setLoading(false)
    } catch (error) {
      console.error('Request Error: An issue occurred', error);
      showToast({
        title: 'Request Error: An issue occurred',
        status: 'error'
      }, toast);
    }
  };

  const updateJob = async () => {
    try {
      _modalContext.onOpenLoading()
      const formData = new FormData();
      // Adiciona o arquivo ao FormData com o nome 'file'
      if(file) formData.append('file', file);
      const jobsFields = ['name', 'type'];
      jobsFields.forEach(field => {
        if (jobModel[field]) {
          formData.append(field, jobModel[field]);
        }
      });
      const response = await fetch(`https://backend-my-site.onrender.com/jobs/${params.slug[1]}`, {
        method: 'PATCH',
        headers: {
          //'Content-Type': 'application/json', // Tipo de conteúdo que você está enviando
          'Authorization': `Bearer ${_userContext?.token}`,
        },
        body: formData,
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
      _modalContext.onCloseLoading()
      //console.log('Resposta da API:', responseData);
      router.push('/feed/trabalhos')
    } catch (error) {
      _modalContext.onCloseLoading()
      console.error('Request Error: An issue occurred', error);
      showToast({
        title: 'Request Error: An issue occurred',
        status: 'error'
      }, toast);
    }
  };

  const next = (isEdit: boolean) => {
    if(!isEdit) {
      createJobFetch()
    } else {
      updateJob()
    }
  }

  useEffect(() => {
    setIsEditing(params.slug[0] === 'criar' ? false : true)
    if(params.slug[0] === 'criar') {
      setLoading(false)
    } else {
      getJobFetch()
    }
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
              <BreadcrumbLink color="black">{isEditing ? `Editar` : `Criar`} trabalho</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          <div className="flex items-center">
            <ToolsMenu options={optionsToolsMenu} />
          </div>
        </div>
        </div>
        <div className="col-span-1 mt-4">
          <h1 className="mb-0 text-xl lg:text-2xl">{isEditing ? `Editar` : `Criar`} trabalho</h1>
        </div>
        <div className="col-span-1 mt-4 bg-white shadow-lg rounded p-3">
          <p className="mb-0">Vamos {isEditing ? `editar` : `criar`} uma trabalho</p>
        </div>
        <div className="col-span-1 mt-4 bg-white shadow-lg rounded p-3">
          <div className="grid grid-cols-1">
            <div className="col-span-1">
              <FormControl>
                <FormLabel>Imagem:</FormLabel>
                <CropImage getData={getData} aspect={aspect} titleButton={imageSrc ? `Mudar imagem` : `Escolher imagem`} imageInitial={imageSrc} isImage={isImage} />
                <FormHelperText>É preciso escolher uma imagem.</FormHelperText>
              </FormControl>
              { 
              isImage &&  <div className="flex items-center mt-3">
                            <span className="mr-3">Imagem escolhida:</span>
                            <ShowImage img={imageSrc} />
                          </div>
              }
            </div>
            <div className="col-span-1">
              <FormControl>
                <FormLabel>Nome:</FormLabel>
                <Input type='text'  bg="rgba(255, 255, 255, 0.8)" textColor="black" max="23" value={jobModel.name} onChange={handleNameChange} />
                <FormHelperText>É preciso escolher um nome.</FormHelperText>
              </FormControl>
            </div>
            <div className="col-span-1 mt-2">
              <FormControl>
                <FormLabel>Tipo:</FormLabel>
                <Input type='text'  bg="rgba(255, 255, 255, 0.8)" textColor="black" max="23" value={jobModel.type} onChange={handleTypeChange} />
                <FormHelperText>É preciso escolher um tipo.</FormHelperText>
              </FormControl>
            </div>
            <div className="col-span-1 mt-4">
              <div className="flex items-center">
                <Button style={{ backgroundColor: "#718096", color: "white" }} className="mr-2">Limpar</Button>
                <Button onClick={() => next(isEditing)} colorScheme='green' className="mr-2">{isEditing ? `Salvar` : `Criar`}</Button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
