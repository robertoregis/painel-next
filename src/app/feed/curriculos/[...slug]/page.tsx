'use client'
import Image from "next/image";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  Tooltip,
  Icon,
  Tag,
  TagLabel,
  Wrap,
  WrapItem
} from '@chakra-ui/react';
import { ChevronRightIcon, SearchIcon } from '@chakra-ui/icons';
import { MdCleaningServices } from "react-icons/md";
import React, { useEffect, useState, useContext } from "react";
import { buildQueryString } from "../../../utils/textFormatters";
import { useRouter, useParams } from 'next/navigation';
import { UserContext } from "@/app/context/UserContext";
import ToolsMenu from "@/app/components/ToolsMenu";
import { showToast } from "@/app/utils/chakra";
import { removeFromLocalStorage } from "@/app/utils/localStorage";
import SelectData from "@/app/components/SelectData";
import { ModalContext } from "@/app/context/ModalContext";

interface paramsUserDTO {
  id?: string;
  username?: string;
}


export default function Home() {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<any[]>([])
  const [usersSelected, setUsersSelected] = useState<any[]>([])
  //const [userId, setUserId] = useState<any>()
  const [username, setUsername] = useState<any>('')
  const [curriculumModel, setCurriculumModel] = useState<any>({
    name: null,
    userId: null
  })
  const router = useRouter();
  const params: any = useParams();
  const [firstFetch, setFirstFetch] = useState(false)
  const toast = useToast()
  const _userContext = useContext(UserContext);
  const _modalContext = useContext(ModalContext);
  const [isCreating, setIsCreating] = useState<boolean>(false)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const optionsToolsMenu: any = []

  let handleNameChange = (e: any) => {
    let inputValue = e.target.value
    setCurriculumModel((prevState: any) => ({
      ...prevState,
      name: inputValue
    }));
  }
  let handleUsernameChange = (e: any) => {
    let inputValue = e.target.value
    setUsername(inputValue);
  }

  const onChangeSelectData = (values: any[]) => {
    if(values.length > 0 && values[0]) {
      setCurriculumModel((prevState: any) => ({
        ...prevState,
        userId: values[0].id
      }));
      let users: any = []
      users.push(values[0])
      setUsersSelected(users)
    } else {
      setCurriculumModel((prevState: any) => ({
        ...prevState,
        userId: null
      }));
      setUsersSelected([])
    }
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

  const createCurriculumFetch = async () => {
    setIsCreating(true)
    try {
      _modalContext.onOpenLoading()
      const response = await fetch('https://backend-my-site.onrender.com/curriculuns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Tipo de conteúdo que você está enviando
          'Authorization': `Bearer ${_userContext?.token}`,
        },
        body: JSON.stringify(curriculumModel),
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
        router.push('/feed/curriculos');
      } else {
        showToast({
          description: responseData.message,
          status: 'error'
        }, toast);
      }
      _modalContext.onCloseLoading()
      setIsCreating(false)
    } catch (error) {
      setIsCreating(false)
      _modalContext.onCloseLoading()
      console.error('Request Error: An issue occurred', error);
      showToast({
        title: 'Request Error: An issue occurred',
        status: 'error'
      }, toast);
    }
  };

  const clearUsers = () => {
    setUsers([])
    setFirstFetch(false)
    //setUserId('')
    setUsername('')
  }
  const handleKeyDown = (event: any) => {
    // Verifica se a tecla pressionada é "Enter" (código 13)
    if (event.key === 'Enter' || event.keyCode === 13) {
      // Chama a função para buscar o usuário quando Enter é pressionado
      getUsersFetch();
    }
  }
  const getUsersFetch = async () => {
    if(!username) {
      toast({
        title: null,
        description: "É preciso digitar alguma letra",
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }
    try {
      const query: paramsUserDTO = {
        id: '',
        username: username
      };
      const queryString = buildQueryString(query)
      const response = await fetch(`https://backend-my-site.onrender.com/users?${queryString}`, {
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
        let usersFind: any = []
        responseData.data.users.forEach((user: any) => {
          usersFind.push({
            id: user.id,
            name: user.username
          })
        })
        setUsers(usersFind)
      }
      setFirstFetch(true)
      console.log('Resposta da API:', responseData);
    } catch (error) {
      console.error('Erro ao enviar requisição:', error);
    }
  };

  const getCurriculumFetch = async () => {
    try {
      const response = await fetch(`https://backend-my-site.onrender.com/curriculuns/${params.slug[1]}`, {
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
        if(responseData.data.curriculum.user) {
          let usersFind: any = []
          usersFind.push({
            id: responseData.data.curriculum.user.id,
            name: responseData.data.curriculum.user.username
          })
          setUsersSelected(usersFind)
          setUsers(usersFind)
          setFirstFetch(true)
        }
        setCurriculumModel(responseData.data.curriculum)
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

  const updateCurriculum = async () => {
    try {
      _modalContext.onOpenLoading()
      const formData = new FormData();
      // Adiciona o arquivo ao FormData com o nome 'file'
      const curriculumFields = ['name', 'userId'];
      curriculumFields.forEach(field => {
        if (curriculumModel[field]) {
          formData.append(field, curriculumModel[field]);
        }
      });
      const response = await fetch(`https://backend-my-site.onrender.com/curriculuns/${params.slug[1]}`, {
        method: 'PATCH',
        headers: {
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
        toast({
          title: null,
          description: responseData.message,
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      } else {
        toast({
          title: null,
          description: responseData.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      }
      _modalContext.onCloseLoading()
    } catch (error) {
      _modalContext.onCloseLoading()
      console.log(error)
      toast({
        title: null,
        description: "Não foi possível atualizar a currículo",
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const next = (isEdit: boolean) => {
    if(!isEdit) {
      createCurriculumFetch()
    } else {
      updateCurriculum()
    }
  }

  const showData = () => {
    if(firstFetch) {
      if(users.length > 0) {
        return (
          <div className="mt-2">
            <SelectData options={users} onChangeCheckbox={onChangeSelectData} optionsSelected={usersSelected} />
          </div>
        )
      } else {
        return (
          <div className="mt-2">
            <span className="text-sm font-[500] text-red-700">Não tem nenhum usuário com este nome</span>
          </div>
        )
      }
      
    }
  }

  useEffect(() => {
    setIsEditing(params.slug[0] === 'criar' ? false : true)
    if(params.slug[0] === 'criar') {
      setLoading(false)
    } else {
      getCurriculumFetch()
    }
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
              <BreadcrumbLink color="black">{isEditing ? `Editar` : `Criar`} currículo</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          <div className="flex items-center">
            <ToolsMenu options={optionsToolsMenu} />
          </div>
        </div>
        </div>
        <div className="col-span-1 mt-4">
          <h1 className="mb-0 text-xl lg:text-2xl">{isEditing ? `Editar` : `Criar`} currículo</h1>
        </div>
        <div className="col-span-1 mt-4 bg-white shadow-lg rounded p-3">
          <p className="mb-0">Vamos {isEditing ? `editar` : `criar`} uma currículo</p>
        </div>
        <div className="col-span-1 mt-4 bg-white shadow-lg rounded p-3">
          <div className="grid grid-cols-1">
          <div className="col-span-1 mt-3">
              <div className="flex flex-col">
              <FormControl>
              <FormLabel>Usuário:</FormLabel>
              <InputGroup size='md'>
                <Input
                  pr='4.5rem'
                  type="text"
                  placeholder='Buscar usuário'
                  value={username}
                  onChange={handleUsernameChange}
                  onKeyDown={handleKeyDown}
                />
                <InputRightElement width='4rem' className="mr-2">
                  <Tooltip label='Limpar'>
                  <Button onClick={clearUsers} h='1.75rem' size='sm' colorScheme='teal' variant='solid' className="mr-2">
                      <Icon as={MdCleaningServices} />                    
                  </Button>
                  </Tooltip>
                  <Tooltip label='Buscar'>
                  <Button onClick={getUsersFetch} h='1.75rem' size='sm' colorScheme='teal' variant='solid'>
                      <SearchIcon />
                  </Button>
                  </Tooltip>
                </InputRightElement>
              </InputGroup>
              <FormHelperText>É preciso escolher um usuário.</FormHelperText>
              </FormControl>
              {showData()}
              <Wrap spacing={2} marginTop={2}>
                {usersSelected.map((user: any, indice: any) => (
                  <WrapItem key={indice}>
                    <Tag
                      size="md"
                      borderRadius="full"
                      variant="solid"
                      colorScheme="teal"
                    >
                      <TagLabel>{user.name}</TagLabel>
                    </Tag>
                  </WrapItem>
                ))}
              </Wrap>
              </div>
            </div>
            <div className="col-span-1 mt-3">
              <FormControl>
                <FormLabel>Nome:</FormLabel>
                <Input type='text'  bg="rgba(255, 255, 255, 0.8)" textColor="black" max="23" value={curriculumModel.name} onChange={handleNameChange} />
                <FormHelperText>É preciso escolher um nome.</FormHelperText>
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
