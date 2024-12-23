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
  Textarea,
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
import React, { useContext, useEffect, useState } from "react";
import { useRouter, useParams } from 'next/navigation';
import Editor from "@/app/components/Editor";
import { buildQueryString } from "../../../utils/textFormatters";
import CropImage from "@/app/components/CropImage";
import ShowImage from "@/app/components/ShowImage";
import { UserContext } from "@/app/context/UserContext";
import SelectData from "@/app/components/SelectData";
import ToolsMenu from "@/app/components/ToolsMenu";
import { showToast } from "@/app/utils/chakra";
import { removeFromLocalStorage } from "@/app/utils/localStorage";
import { ModalContext } from "@/app/context/ModalContext";

interface paramsUserDTO {
  id?: string;
  username?: string;
}

export default function Home() {
  //let [value, setValue] = React.useState('')
  //const [show, setShow] = React.useState(false)
  const [users, setUsers] = useState<any[]>([])
  const [usersSelected, setUsersSelected] = useState<any[]>([])
  //const [userId, setUserId] = useState<any>()
  const [username, setUsername] = useState<any>('')
  const _userContext = useContext(UserContext);
  const _modalContext = useContext(ModalContext);
  const [postModel, setPostModel] = useState<any>({
    title: '',
    description: '',
    body: '',
    userId: '',
  })
  const params: any = useParams()
  const [isCreating, setIsCreating] = useState<boolean>(false)
  const [file, setFile] = useState<any>()
  const router = useRouter();
  const [content, setContent] = useState('')
  const [firstFetch, setFirstFetch] = useState(false)
  const [isInit, setIsInit] = useState<boolean>(false)
  const toast = useToast()
  const [imageSrc, setImageSrc] = useState('');
  const [isImage, setIsImage] = useState<boolean>(false)
  const [aspect, setAspect] = useState(16 / 9); // Valor padrão
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const optionsToolsMenu: any = []

  let handleDescriptionChange = (e: any) => {
    let inputValue = e.target.value
    setPostModel((prevState: any) => ({
      ...prevState,
      description: inputValue
    }));
  }
  let handleTitleChange = (e: any) => {
    let inputValue = e.target.value
    setPostModel((prevState: any) => ({
      ...prevState,
      title: inputValue
    }));
  }
  let handleUsernameChange = (e: any) => {
    let inputValue = e.target.value
    setUsername(inputValue);
  }
  /*const handleUserIdChange = (e: any) => {
    let inputValue = e.target.value
    setPostModel((prevState: any) => ({
      ...prevState,
      userId: inputValue
    }));
  }*/

  const onChangeSelectData = (values: any[]) => {
    if(values.length > 0 && values[0]) {
      setPostModel((prevState: any) => ({
        ...prevState,
        userId: values[0].id
      }));
      let users: any = []
      users.push(values[0])
      setUsersSelected(users)
    } else {
      setPostModel((prevState: any) => ({
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

  const getData = (img: any) => {
    setImageSrc(img.url)
    setFile(img.file)
    setIsImage(true)
	}

  const createPostFetch = async () => {
    if(!postModel.title) {
      toast({
        title: 'Não foi possível criar!',
        description: 'É preciso escolher um título',
        status: 'error',
        position: 'bottom-right',
        isClosable: true,
      })
      return
    }
    if(!postModel.description) {
      toast({
        title: 'Não foi possível criar!',
        description: 'É preciso escolher uma descrição',
        status: 'error',
        position: 'bottom-right',
        isClosable: true,
      })
      return
    }
    if(!postModel.userId) {
      toast({
        title: 'Não foi possível criar!',
        description: 'É preciso escolher um usuário',
        status: 'error',
        position: 'bottom-right',
        isClosable: true,
      })
      return
    }
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
    setIsCreating(true)
    try {
      _modalContext.onOpenLoading()
      // Cria um objeto FormData para enviar os dados
      const formData = new FormData();
      // Adiciona o arquivo ao FormData com o nome 'file'
      formData.append('file', file);
      formData.append('title', postModel.title);
      formData.append('description', postModel.description);
      postModel.body = content
      formData.append('body', postModel.body);
      formData.append('userId', postModel.userId);
      const response = await fetch('https://backend-my-site.onrender.com/posts', {
        method: 'POST',
        headers: {
          // Não é necessário definir Content-Type para FormData
          'Authorization': `Bearer ${_userContext?.token}`,
        },
        body: formData, // Envia o FormData ao invés de JSON.stringify(postModel)
      });
      //console.log(response)
      if (!response.ok) {
        const responseData = await response.json();
        _modalContext.onCloseLoading()
        showToast({
          title: 'Erro de autenticação',
          description: 'Você será deslogado',
          status: 'error'
        }, toast);
        logout()
        return
      }
  
      const responseData = await response.json();
      if(responseData.status !== 0) {
        toast({
          title: 'Publicação criada com sucesso!',
          status: 'success',
          duration: 3000,
          position: 'bottom-right',
          isClosable: true,
        })
        //console.log('Resposta da API:', responseData);
        // Redireciona após o sucesso
        router.push('/feed/publicacoes');
      } else {
        toast({
          title: 'Deu erro ao criar!',
          description: responseData.message,
          status: 'error',
          position: 'bottom-right',
          isClosable: true,
        })
      }
      _modalContext.onCloseLoading()
      setIsCreating(false)
    } catch (error: any) {
      _modalContext.onCloseLoading()
      setIsCreating(false)
      console.error('Erro ao enviar requisição:', error);
      toast({
        title: null,
        description: "Não foi possível atualizar a framework",
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
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

  const getPostFetch = async () => {
    try {
      const response = await fetch(`https://backend-my-site.onrender.com/posts/${params.slug[1]}`, {
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
        if(responseData.data.post.body) {
          setContent(responseData.data.post.body)
        }
        if(responseData.data.post.user) {
          let usersFind: any = []
          usersFind.push({
            id: responseData.data.post.user.id,
            name: responseData.data.post.user.username
          })
          setIsInit(true)
          setUsersSelected(usersFind)
          setUsers(usersFind)
          setFirstFetch(true)
        }
        if(responseData.data.post.imageUrl) {
          setImageSrc(responseData.data.post.imageUrl)
          setIsImage(true)
        }
        setPostModel(responseData.data.post)
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

  const updatePost = async () => {
    try {
      _modalContext.onOpenLoading()
      const formData = new FormData();
      // Adiciona o arquivo ao FormData com o nome 'file'
      if(file) formData.append('file', file);
      postModel.body = content
      const postFields = ['title', 'description', 'body', 'userId'];
      postFields.forEach(field => {
        if (postModel[field]) {
          formData.append(field, postModel[field]);
        }
      });
      const response = await fetch(`https://backend-my-site.onrender.com/posts/${params.slug[1]}`, {
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
        description: "Não foi possível atualizar a publicação",
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const next = (isEdit: boolean) => {
    if(!isEdit) {
      createPostFetch()
    } else {
      updatePost()
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
      getPostFetch()
    }
  }, [])

  return (
    <main className="flex w-full p-4">
      <div className="grid grid-cols-1 w-full">
        <div className="col-span-1 bg-white shadow-lg rounded p-2">
        <div className="flex items-center justify-between">
          <Breadcrumb spacing='4px' separator={<ChevronRightIcon w={5} h={5} color='black' />}>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => goRouter('/feed/publicacoes')} color="black">Publicações</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink color="black">{isEditing ? `Editar` : `Criar`} publicação</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          <div className="flex items-center">
            <ToolsMenu options={optionsToolsMenu} />
          </div>
        </div>
        </div>
        <div className="col-span-1 mt-4">
          <h1 className="mb-0 text-xl lg:text-2xl">{isEditing ? `Editar` : `Criar`} publicação</h1>
        </div>
        <div className="col-span-1 mt-4 bg-white shadow-lg rounded p-3">
          <p className="mb-0">Vamos {isEditing ? `editar` : `criar`} uma publicação</p>
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
                <FormLabel>Título:</FormLabel>
                <Input type='text'  bg="rgba(255, 255, 255, 0.8)" textColor="black" max="23" value={postModel.title} onChange={handleTitleChange} />
                <FormHelperText>É preciso escolher um título.</FormHelperText>
              </FormControl>
            </div>
            <div className="col-span-1 mt-2">
              <FormControl>
                <FormLabel>Descrição:</FormLabel>
                <Textarea
                  value={postModel.description}
                  onChange={handleDescriptionChange}
                  placeholder='Digite a sua descrição'
                  size='sm'
                  height="100px"
                  bg="rgba(255, 255, 255, 0.8)" textColor="black"
                />
                <FormHelperText>É preciso escolher uma descrição.</FormHelperText>
              </FormControl>
            </div>
            <div className="col-span-1 mt-2">
              <FormControl>
                <FormLabel>Corpo:</FormLabel>
                <Editor content={content} setContent={setContent} />
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
