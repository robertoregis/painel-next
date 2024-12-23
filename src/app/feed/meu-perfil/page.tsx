'use client'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  useToast,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  SkeletonText
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import React, { useEffect, useState, useContext } from "react";
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { UserContext } from "@/app/context/UserContext";
import CropImage from '@/app/components/CropImage';
import ShowImage from '@/app/components/ShowImage';
import { showToast } from '@/app/utils/chakra';
import { removeFromLocalStorage, saveToLocalStorage } from '@/app/utils/localStorage';
import ToolsMenu from '@/app/components/ToolsMenu';
import { ModalContext } from "@/app/context/ModalContext";

export default function Home() {
  const [show, setShow] = React.useState(false)
  const [password, setPassword] = React.useState<any>('')
  const [showOld, setShowOld] = React.useState(false)
  const [passwordOld, setPasswordOld] = React.useState<any>('')
  const handleClick = () => setShow(!show)
  const handleClickOld = () => setShowOld(!showOld)
  const router = useRouter();
  const _userContext = useContext(UserContext);
  const _modalContext = useContext(ModalContext);
  const toast = useToast()
  const [loading, setLoading] = useState<boolean>(true)
  const [userModel, setUserModel] = useState<any>({
    username: '',
    email: '',
    city: '',
    cityId: '',
    state: '',
    stateId: ''
  })
  const [states, setStates] = useState<any[]>([])
  const [stateSelected, setStateSelected] = useState<any>();
  const [cities, setCities] = useState<any[]>([])
  const [citySelected, setCitySelected] = useState<any>();
  const [imageSrc, setImageSrc] = useState('');
  const [isImage, setIsImage] = useState<boolean>(false)
  const [file, setFile] = useState<any>()
  const [aspect, setAspect] = useState(4 / 4); // Valor padrão
  const optionsToolsMenu: any = []

  const handlePasswordChange = (e: any) => {
    let inputValue = e.target.value
    setPassword(inputValue)
  }
  const handlePasswordOldChange = (e: any) => {
    let inputValue = e.target.value
    setPasswordOld(inputValue)
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

  const getUserFetch = async () => {
    try {
      const response = await fetch(`https://backend-my-site.onrender.com/users/${_userContext?.user.id}`, {
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
        let user: any = responseData.data.user
        user.cityId = responseData.data.user.cityId ? responseData.data.user.cityId : ''
        user.stateId = responseData.data.user.cityId ? responseData.data.user.cityId : ''
        setUserModel(user)
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
      const response = await fetch(`https://backend-my-site.onrender.com/users/${_userContext?.user.id}`, {
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
        description: "Não foi possível atualizar o usuário",
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const updatePassword = async () => {
    if(!password) {
      toast({
        title: null,
        description: "É preciso digitar a senha nova",
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }
    if(!passwordOld) {
      toast({
        title: null,
        description: "É preciso digitar a senha antiga",
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }
    try {
      _modalContext.onOpenLoading()
      let passwordData = {
        old: passwordOld,
        new: password
      }
      const response = await fetch(`https://backend-my-site.onrender.com/users/${_userContext?.user.id}/update-password`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${_userContext?.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordData),
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
        setPassword(null)
        setPasswordOld(null)
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
        description: "Não foi possível atualizar a senha",
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const next = () => {
    updateUser()
  }

  useEffect(() => {
    getStates()
    getUserFetch()
  }, [])

  return (
    <main className="flex w-full p-4">
      <div className="grid grid-cols-1 w-full">

        <div className="col-span-1 bg-white shadow-lg rounded p-2">
          <div className="flex items-center justify-between">
            <Breadcrumb spacing='4px' separator={<ChevronRightIcon w={5} h={5} color='black' />}>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink color="black">Meu Perfil</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
            <div className="flex items-center">
              <ToolsMenu options={optionsToolsMenu} />
            </div>
          </div>
        </div>

        <div className="col-span-1 mt-4">
          <h1 className="mb-0 text-xl lg:text-2xl">Meu Perfil</h1>
        </div>

        <div className="col-span-1 mt-4 bg-white shadow-lg rounded p-3">
          <div className="flex flex-col items-start">
          <span>Olá, <span className="font-[600]">{_userContext?.user.username}</span>. Seja bem vindo a página do seu perfil!</span>
          </div>
        </div>

        {
          !loading ?
          <div className="col-span-1 mt-4 bg-white shadow-lg rounded p-3">
          <div className="grid grid-cols-1">
            <div className="col-span-1">
              <h2 className="text-2xl">Atualize os seus dados</h2>
            </div>
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
            <div className="col-span-1 mt-2">
            <FormControl>
              <FormLabel>Estado:</FormLabel>
              <Select onChange={handleStateChange} value={userModel.stateId} placeholder='Selecione um estado' bg="rgba(255, 255, 255, 0.8)" textColor="black" iconColor="black" ringColor="black">
                {states.map((state: any, index: any) => (
                  <option value={state.id} key={index}>{state.nome}</option>
                ))}
              </Select>
            </FormControl>
            </div>
            <div className="col-span-1 mt-2">
            <FormControl>
              <FormLabel>Cidade:</FormLabel>
              <Select onChange={handleCityChange} value={userModel.cityId} disabled={!cities.length ? true : false} placeholder='Selecione uma cidade' bg="rgba(255, 255, 255, 0.8)" textColor="black" iconColor="black" ringColor="black">
                {cities.map((city: any, index: any) => (
                  <option value={city.id} key={index}>{city.nome}</option>
                ))}
              </Select>
            </FormControl>
            </div>
            <div className="col-span-1 mt-4">
              <div className="flex items-center">
                <Button style={{ backgroundColor: "#718096", color: "white" }} className="mr-2">Limpar</Button>
                <Button onClick={() => next()} colorScheme='green' className="mr-2">Salvar</Button>
              </div>
            </div>

          </div>
        </div> :
        <div className="col-span-1 bg-white shadow-lg rounded p-3 mt-4">
          <SkeletonText mt="4" noOfLines={1} skeletonHeight='300' className="w-full" />
        </div>
        }

        {
          !loading ?
          <div className="col-span-1 mt-4 bg-white shadow-lg rounded p-3">
          <div className="grid grid-cols-1">
            <div className="col-span-1">
              <h2 className="text-2xl">Mude a sua senha</h2>
            </div>
            <div className="col-span-1">
              <FormControl>
                <FormLabel>Senha antiga</FormLabel>
                <InputGroup size='md'>
                  <Input
                    pr='4.5rem'
                    type={showOld ? 'text' : 'password'}
                    placeholder='Digite a sua senha nova'
                    bg="rgba(255, 255, 255, 0.8)" textColor="black"
                    value={passwordOld}
                    onChange={handlePasswordOldChange}
                  />
                  <InputRightElement width='4.5rem'>
                    <Button h='1.75rem' size='sm' onClick={handleClickOld} className="mr-2">
                      {showOld ? 'Esconder' : 'Mostrar'}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormHelperText>É preciso escolher uma senha.</FormHelperText>
              </FormControl>
            </div>
            <div className="col-span-1 mt-2">
              <FormControl>
                <FormLabel>Senha nova</FormLabel>
                <InputGroup size='md'>
                  <Input
                    pr='4.5rem'
                    type={show ? 'text' : 'password'}
                    placeholder='Digite a sua senha antiga'
                    bg="rgba(255, 255, 255, 0.8)" textColor="black"
                    value={password}
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
            <div className="col-span-1 mt-4">
              <div className="flex items-center">
                <Button style={{ backgroundColor: "#718096", color: "white" }} className="mr-2">Limpar</Button>
                <Button onClick={() => updatePassword()} colorScheme='green' className="mr-2">Salvar</Button>
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
