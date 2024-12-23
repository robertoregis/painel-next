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
  Select,
  useToast,
  SkeletonText
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import React, { useEffect, useState, useContext } from "react";
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { UserContext } from '@/app/context/UserContext';
import CropImage from '@/app/components/CropImage';
import ShowImage from '@/app/components/ShowImage';
import AddRoleInUser from '@/app/components/AddRoleInUser';
import { showToast } from '@/app/utils/chakra';
import { removeFromLocalStorage, saveToLocalStorage } from '@/app/utils/localStorage';
import ToolsMenu from '@/app/components/ToolsMenu';
import { ModalContext } from '@/app/context/ModalContext';

export default function Home() {
  const [show, setShow] = React.useState(false)
  const handleClick = () => setShow(!show)
  const [userModel, setUserModel] = useState<any>({
    username: null,
    password: null,
    email: null,
    city: null,
    cityId: '',
    state: null,
    stateId: ''
  })
  const _userContext = useContext(UserContext);
  const _modalContext = useContext(ModalContext);
  const router = useRouter();
  const params: any = useParams()
  const [states, setStates] = useState<any[]>([])
  const [stateSelected, setStateSelected] = useState<any>();
  const [cities, setCities] = useState<any[]>([])
  const [citySelected, setCitySelected] = useState<any>();
  const [imageSrc, setImageSrc] = useState('');
  const [isImage, setIsImage] = useState<boolean>(false)
  const [file, setFile] = useState<any>()
  const [isCreating, setIsCreating] = useState<boolean>(false)
  const toast = useToast()
  const [aspect, setAspect] = useState(4 / 4); // Valor padrão
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const optionsToolsMenu: any = []

  const handlePasswordChange = (e: any) => {
    let inputValue = e.target.value
    setUserModel((prevState: any) => ({
      ...prevState,
      password: inputValue
    }));
  }
  const handleUsernameChange = (e: any) => {
    let inputValue = e.target.value
    setUserModel((prevState: any) => ({
      ...prevState,
      username: inputValue
    }));
  }
  const handleEmailChange = (e: any) => {
    let inputValue = e.target.value
    setUserModel((prevState: any) => ({
      ...prevState,
      email: inputValue
    }));
  }
  const handleStateChange = (e: any) => {
    let inputValue = e.target.value
    let statesFilter = states.filter((state) => {
      return state.id === Number(inputValue)
    })
    setStateSelected(statesFilter[0])
    setUserModel((prevState: any) => ({
      ...prevState,
      state: statesFilter[0].nome,
      stateId: statesFilter[0].id
    }));
    getCities(statesFilter[0].id)
  }
  const handleCityChange = (e: any) => {
    let inputValue = e.target.value
    let citiesFilter = cities.filter((city) => {
      return city.id === Number(inputValue)
    })
    setCitySelected(citiesFilter[0])
    setUserModel((prevState: any) => ({
      ...prevState,
      city: citiesFilter[0].nome,
      cityId: citiesFilter[0].id
    }));
  }

  const getData = (img: any) => {
    setImageSrc(img.url)
    setFile(img.file)
    setIsImage(true)
	}

  const changeUser = () => {
    getUserFetch()
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
    
  const getStates = async () => {
    try {
      const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json', // Tipo de conteúdo que você está enviando
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar requisição.');
      }
            
      const responseData = await response.json()
      setStates(responseData.sort((a: any, b: any) => a.nome.localeCompare(b.nome)))
      console.log(responseData)
    } catch (error) {
      console.error('Erro ao enviar requisição:', error);
    }
  }
  const getCities = async (id: string) => {
    try {
      const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${id}/distritos`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json', // Tipo de conteúdo que você está enviando
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar requisição.');
      }
            
      const responseData = await response.json()
      setCities(responseData.sort((a: any, b: any) => a.nome.localeCompare(b.nome)))
      // states.value = response.data.value.sort((a: any, b: any) => a.nome.localeCompare(b.nome))
      console.log(responseData)
    } catch (error) {
      console.error('Erro ao enviar requisição:', error);
    }
  }

  const createUserFetch = async () => {
    setIsCreating(true)
    try {
      _modalContext.onOpenLoading()
      // Cria um objeto FormData para enviar os dados
      const formData = new FormData();
      // Adiciona o arquivo ao FormData com o nome 'file'
      formData.append('file', file);
      formData.append('username', userModel.username);
      formData.append('password', userModel.password);
      formData.append('email', userModel.email);
      formData.append('city', userModel.city);
      formData.append('state', userModel.state);
      formData.append('cityId', userModel.cityId);
      formData.append('stateId', userModel.stateId);
      const response = await fetch('https://backend-my-site.onrender.com/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${_userContext?.token}`,
        },
        body: formData,
      });
      console.log('oooo')
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
        router.push('/feed/usuarios');
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

  const getUserFetch = async () => {
    try {
      const response = await fetch(`https://backend-my-site.onrender.com/users/${params.slug[1]}`, {
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
        if(responseData.data.user.stateId) {
          getCities(responseData.data.user.stateId)
        }
        if(responseData.data.user.imageUrl) {
          setImageSrc(responseData.data.user.imageUrl)
          setIsImage(true)
        }
        setUserModel(responseData.data.user)
        if(responseData.data.user.id === _userContext?.user.id) {
          _userContext?.setUser(responseData.data.user)
          //
          let newPermissions: any = []
          responseData.data.user.roles.forEach((role: any) => {
              role.permissions.forEach((permission: any) => {
                  if(!newPermissions.includes(permission.value)) {
                      newPermissions.push(permission.value)
                  }
              })
          })
          if(newPermissions.includes('all')) {
              newPermissions = ['all']
          }
          _userContext?.setPermissions(newPermissions)
          //
          const storage = {
            user: responseData.data.user,
            token: _userContext?.token,
            data: new Date()
          }
          saveToLocalStorage('user_data_client', storage)
        }
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

  const updateUser = async () => {
    try {
      _modalContext.onOpenLoading()
      const formData = new FormData();
      // Adiciona o arquivo ao FormData com o nome 'file'
      if(file) formData.append('file', file);
      const userFields = ['username', 'email', 'city', 'state', 'cityId', 'stateId'];
      userFields.forEach(field => {
        if (userModel[field]) {
          formData.append(field, userModel[field]);
        }
      });
      const response = await fetch(`https://backend-my-site.onrender.com/users/${params.slug[1]}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${_userContext?.token}`,
        },
        body: formData,
      });
      
      if (!response.ok) {
        _modalContext.onCloseLoading()
        throw new Error('Erro ao enviar requisição.');
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
        description: "Não foi possível atualizar o usuário",
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const next = (isEdit: boolean) => {
    if(!isEdit) {
      createUserFetch()
    } else {
      updateUser()
    }
  }

  useEffect(() => {
    getStates()
    setIsEditing(params.slug[0] === 'criar' ? false : true)
    if(params.slug[0] === 'criar') {
      setLoading(false)
    } else {
      getUserFetch()
    }
  }, [])

  return (
    <main className="flex w-full p-4">
      <div className="grid grid-cols-1 w-full">
        <div className="col-span-1 bg-white shadow-lg rounded p-2">
        <div className="flex items-center justify-between">
          <Breadcrumb spacing='4px' separator={<ChevronRightIcon w={5} h={5} color='black' />}>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => goRouter('/feed/usuarios')} color="black">Usuarios</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink color="black">{isEditing ? `Editar` : `Criar`} usuário</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          <div className="flex items-center">
            <ToolsMenu options={optionsToolsMenu} />
          </div>
        </div>
        </div>
        <div className="col-span-1 mt-4">
          <h1 className="mb-0 text-xl lg:text-2xl">{isEditing ? `Editar` : `Criar`} usuário</h1>
        </div>
        <div className="col-span-1 mt-4 bg-white shadow-lg rounded p-3">
          <p className="mb-0">Vamos {isEditing ? `editar` : `criar`} um usuário</p>
          {
            isEditing && !loading && (
              <>
              <div className="flex mt-2">
                <AddRoleInUser user={userModel} changeUser={changeUser} />
              </div>
              </>
            )
          }
        </div>
        {
          !loading ?
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
            <div className="col-span-1 mt-2">
              <FormControl>
                <FormLabel>Nome:</FormLabel>
                <Input type='text'  bg="rgba(255, 255, 255, 0.8)" textColor="black" max="23" value={userModel.username} onChange={handleUsernameChange} />
                <FormHelperText>É preciso escolher um nome.</FormHelperText>
              </FormControl>
            </div>
            <div className="col-span-1 mt-2">
              <FormControl>
                <FormLabel>Email:</FormLabel>
                <Input onChange={handleEmailChange} value={userModel.email} type='email' bg="rgba(255, 255, 255, 0.8)" textColor="black" />
                <FormHelperText>É preciso escolher um email válido.</FormHelperText>
              </FormControl>
            </div>
            {
              !isEditing && <div className="col-span-1 mt-2">
                              <FormControl>
                                <FormLabel>Senha</FormLabel>
                                <InputGroup size='md'>
                                  <Input
                                    pr='4.5rem'
                                    type={show ? 'text' : 'password'}
                                    placeholder='Digite sua senha'
                                    bg="rgba(255, 255, 255, 0.8)" textColor="black"
                                    value={userModel.password}
                                    onChange={handlePasswordChange}
                                  />
                                  <InputRightElement width='4.5rem'>
                                    <Button h='1.75rem' size='sm' onClick={handleClick} className="mr-2">
                                      {show ? 'Esconder' : 'Mostrar'}
                                    </Button>
                                  </InputRightElement>
                                </InputGroup>
                                <FormHelperText>É preciso escolher uma senha.</FormHelperText>
                              </FormControl>
                            </div>
            }
            <div className="col-span-1 mt-2">
            <FormControl>
              <FormLabel>Estado:</FormLabel>
              <Select onChange={handleStateChange} value={userModel.stateId} placeholder='Selecione um estado' bg="rgba(255, 255, 255, 0.8)" textColor="black" iconColor="black" ringColor="black">
                {states.map((state: any, index: any) => (
                  <option value={state.id}>{state.nome}</option>
                ))}
              </Select>
            </FormControl>
            </div>
            <div className="col-span-1 mt-2">
            <FormControl>
              <FormLabel>Cidade:</FormLabel>
              <Select onChange={handleCityChange} value={userModel.cityId} disabled={!cities.length ? true : false} placeholder='Selecione uma cidade' bg="rgba(255, 255, 255, 0.8)" textColor="black" iconColor="black" ringColor="black">
                {cities.map((city: any, index: any) => (
                  <option value={city.id}>{city.nome}</option>
                ))}
              </Select>
            </FormControl>
            </div>
            {/*<div className="col-span-1 mt-2">
              <FormControl>
                <FormLabel>Telefone:</FormLabel>
                <Input as={InputMask} mask="(99) 99999-9999" maskChar={null} bg="rgba(255, 255, 255, 0.8)" textColor="black" />
                <FormHelperText>É preciso escolher um telefone.</FormHelperText>
              </FormControl>
            </div>
            <div className="col-span-1 mt-2">
              <Checkbox defaultChecked>Checkbox</Checkbox>
            </div>
            <div className="col-span-1 mt-2">
              <span>{value}</span>
              <Textarea
                placeholder='Here is a sample placeholder'
                size='sm'
                height="200px"
                bg="rgba(255, 255, 255, 0.8)" textColor="black"
              />
            </div>*/}
            <div className="col-span-1 mt-4">
              <div className="flex items-center">
                <Button style={{ backgroundColor: "#718096", color: "white" }} className="mr-2">Limpar</Button>
                <Button onClick={() => next(isEditing)} colorScheme='green' className="mr-2">{isEditing ? `Salvar` : `Criar`}</Button>
              </div>
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