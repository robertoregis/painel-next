'use client'
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
import CropImage from "@/app/components/CropImage";
import ShowImage from "@/app/components/ShowImage";

interface paramsLanguageDTO {
  id?: string;
  name?: string;
}

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [languages, setLanguages] = useState<any[]>([])
  const [languagesSelected, setLanguagesSelected] = useState<any[]>([])
  //const [languageId, setLanguageId] = useState<any>()
  const [languagename, setLanguagename] = useState<any>('')
  const [imageSrc, setImageSrc] = useState('');
  const [isImage, setIsImage] = useState<boolean>(false)
  const [aspect, setAspect] = useState(16 / 9); // Valor padrão
  const [file, setFile] = useState<any>()
  const [frameworkModel, setFrameworkModel] = useState<any>({
    name: null,
    languageId: null,
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
    setFrameworkModel((prevState: any) => ({
      ...prevState,
      name: inputValue
    }));
  }
  let handleLanguagenameChange = (e: any) => {
    let inputValue = e.target.value
    setLanguagename(inputValue);
  }

  const onChangeSelectData = (values: any[]) => {
    if(values.length > 0 && values[0]) {
      setFrameworkModel((prevState: any) => ({
        ...prevState,
        languageId: values[0].id
      }));
      let languages: any = []
      languages.push(values[0])
      setLanguagesSelected(languages)
    } else {
      setFrameworkModel((prevState: any) => ({
        ...prevState,
        languageId: null
      }));
      setLanguagesSelected([])
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

  const createFrameworkFetch = async () => {
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
      setFrameworkModel((prevState: any) => ({
        ...prevState,
        userId: _userContext?.user.id
      }));
      // Cria um objeto FormData para enviar os dados
      const formData = new FormData();
      // Adiciona o arquivo ao FormData com o nome 'file'
      formData.append('file', file);
      formData.append('name', frameworkModel.name);
      formData.append('languageId', frameworkModel.languageId);
      formData.append('userId', frameworkModel.userId);
      const response = await fetch('https://backend-my-site.onrender.com/frameworks', {
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
        router.push('/feed/frameworks');
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

  const clearLanguages = () => {
    setLanguages([])
    setFirstFetch(false)
    //setLanguageId('')
    setLanguagename('')
  }
  const handleKeyDown = (event: any) => {
    // Verifica se a tecla pressionada é "Enter" (código 13)
    if (event.key === 'Enter' || event.keyCode === 13) {
      // Chama a função para buscar o usuário quando Enter é pressionado
      getLanguagesFetch();
    }
  }
  const getLanguagesFetch = async () => {
    if(!languagename) {
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
      const query: paramsLanguageDTO = {
        id: '',
        name: languagename
      };
      const queryString = buildQueryString(query)
      const response = await fetch(`https://backend-my-site.onrender.com/languagens?${queryString}`, {
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
        let languagesFind: any = []
        responseData.data.languages.forEach((language: any) => {
          languagesFind.push({
            id: language.id,
            name: language.name
          })
        })
        setLanguages(languagesFind)
      }
      setFirstFetch(true)
      //console.log('Resposta da API:', responseData);
    } catch (error) {
      console.error('Erro ao enviar requisição:', error);
    }
  };

  const getFrameworkFetch = async () => {
    try {
      const response = await fetch(`https://backend-my-site.onrender.com/frameworks/${params.slug[1]}`, {
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
        if(responseData.data.framework.language) {
          let languagesFind: any = []
          languagesFind.push({
            id: responseData.data.framework.language.id,
            name: responseData.data.framework.language.name
          })
          if(responseData.data.framework.imageUrl) {
            setImageSrc(responseData.data.language.imageUrl)
            setIsImage(true)
          }
          setLanguagesSelected(languagesFind)
          setLanguages(languagesFind)
          setFirstFetch(true)
        }
        setFrameworkModel(responseData.data.framework)
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

  const updateFramework = async () => {
    try {
      _modalContext.onOpenLoading()
      const formData = new FormData();
      // Adiciona o arquivo ao FormData com o nome 'file'
      if(file) formData.append('file', file);
      const frameworksFields = ['name', 'languageId'];
      frameworksFields.forEach(field => {
        if (frameworkModel[field]) {
          formData.append(field, frameworkModel[field]);
        }
      });
      const response = await fetch(`https://backend-my-site.onrender.com/frameworks/${params.slug[1]}`, {
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
        description: "Não foi possível atualizar a framework",
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const next = (isEdit: boolean) => {
    if(!isEdit) {
      createFrameworkFetch()
    } else {
      updateFramework()
    }
  }

  const showData = () => {
    if(firstFetch) {
      if(languages.length > 0) {
        return (
          <div className="mt-2">
            <SelectData options={languages} onChangeCheckbox={onChangeSelectData} optionsSelected={languagesSelected} />
          </div>
        )
      } else {
        return (
          <div className="mt-2">
            <span className="text-sm font-[500] text-red-700">Não tem nenhuma linguagem com este nome</span>
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
      getFrameworkFetch()
    }
  }, [])

  return (
    <main className="flex w-full p-4">
      <div className="grid grid-cols-1 w-full">
        <div className="col-span-1 bg-white shadow-lg rounded p-2">
        <div className="flex items-center justify-between">
          <Breadcrumb spacing='4px' separator={<ChevronRightIcon w={5} h={5} color='black' />}>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => goRouter('/feed/frameworks')} color="black">Frameworks</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink color="black">{isEditing ? `Editar` : `Criar`} framework</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          <div className="flex items-center">
            <ToolsMenu options={optionsToolsMenu} />
          </div>
        </div>
        </div>
        <div className="col-span-1 mt-4">
          <h1 className="mb-0 text-xl lg:text-2xl">{isEditing ? `Editar` : `Criar`} framework</h1>
        </div>
        <div className="col-span-1 mt-4 bg-white shadow-lg rounded p-3">
          <p className="mb-0">Vamos {isEditing ? `editar` : `criar`} uma framework</p>
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
              <FormLabel>Linguagens:</FormLabel>
              <InputGroup size='md'>
                <Input
                  pr='4.5rem'
                  type="text"
                  placeholder='Buscar linguagem'
                  value={languagename}
                  onChange={handleLanguagenameChange}
                  onKeyDown={handleKeyDown}
                />
                <InputRightElement width='4rem' className="mr-2">
                  <Tooltip label='Limpar'>
                  <Button onClick={clearLanguages} h='1.75rem' size='sm' colorScheme='teal' variant='solid' className="mr-2">
                      <Icon as={MdCleaningServices} />                    
                  </Button>
                  </Tooltip>
                  <Tooltip label='Buscar'>
                  <Button onClick={getLanguagesFetch} h='1.75rem' size='sm' colorScheme='teal' variant='solid'>
                      <SearchIcon />
                  </Button>
                  </Tooltip>
                </InputRightElement>
              </InputGroup>
              <FormHelperText>É preciso escolher uma linguagem.</FormHelperText>
              </FormControl>
              {showData()}
              <Wrap spacing={2} marginTop={2}>
                {languagesSelected.map((language: any, indice: any) => (
                  <WrapItem key={indice}>
                    <Tag
                      size="md"
                      borderRadius="full"
                      variant="solid"
                      colorScheme="teal"
                    >
                      <TagLabel>{language.name}</TagLabel>
                    </Tag>
                  </WrapItem>
                ))}
              </Wrap>
              </div>
            </div>
            <div className="col-span-1 mt-3">
              <FormControl>
                <FormLabel>Nome:</FormLabel>
                <Input type='text'  bg="rgba(255, 255, 255, 0.8)" textColor="black" max="23" value={frameworkModel.name} onChange={handleNameChange} />
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
