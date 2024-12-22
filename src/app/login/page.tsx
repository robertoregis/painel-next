'use client'
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useToast
} from '@chakra-ui/react';
import React, { useEffect, useState, useContext } from "react";
import { useRouter } from 'next/navigation';
import { UserContext } from '../context/UserContext';
import { ConfigContext } from '../context/ConfigContext';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/localStorage';
import { ModalContext } from '../context/ModalContext';

interface UserLogin {
  email: string;
  password: string;
}

export default function Home() {
  const [show, setShow] = React.useState(false)
  const handleClick = () => setShow(!show)
  const [userLogin, setUserLogin] = useState<UserLogin>({
    email: '',
    password: ''
  })
  const router = useRouter();
  const toast = useToast()
  const [isLogin, setIsLogin] = useState<boolean>(false)
  const _userContext = useContext(UserContext)
  const _configContext = useContext(ConfigContext);
  const _modalContext = useContext(ModalContext);
  //const searchParams = useSearchParams();  // Use useSearchParams to get URL params
  //const params = useParams()

  const handlePasswordChange = (e: any) => {
    let inputValue = e.target.value
    setUserLogin((prevState: any) => ({
      ...prevState,
      password: inputValue
    }));
  }
  const handleEmailChange = (e: any) => {
    let inputValue = e.target.value
    setUserLogin((prevState: any) => ({
      ...prevState,
      email: inputValue
    }));
  }

  const goRouter = (url: string) => {
		router.push(url);
	}

  const getConfig = async (token: string) => {
    if(!_configContext?.config || Object.keys(_configContext.config).length === 0) {
      const config = loadFromLocalStorage('config_data_client')
      if(config) {
        _configContext?.setConfig(config)
      } else {
        try {
          const response = await fetch('https://backend-my-site.onrender.com/config/1', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json', // Tipo de conteúdo que você está enviando
              'Authorization': `Bearer ${token}`,
            }
          });
          
          if (!response.ok) {
            throw new Error('Erro ao enviar requisição.');
          }
    
          const responseData = await response.json();
          if(responseData.status !== 0) {
            saveToLocalStorage('config_data_client', responseData.data.config)
          }
          //console.log('Resposta da API:', responseData);
        } catch (error) {
          console.error('Erro ao enviar requisição:', error);
        }
      }
    }
  }

  const loginUser = async () => {
    if(!userLogin.email) {
      toast({
        description: 'É preciso informar um email',
        status: 'error',
        position: 'bottom-right',
        isClosable: true,
      })
      return
    }
    if(!userLogin.password) {
      toast({
        description: 'É preciso informar uma senha',
        status: 'error',
        position: 'bottom-right',
        isClosable: true,
      })
      return
    }
    setIsLogin(true)
    try {
      _modalContext.onOpenLoading()
      const response = await fetch('https://backend-my-site.onrender.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userLogin),
      });
      if (!response.ok) {
        const responseData = await response.json();
        responseData.message.forEach((message: any) => {
          toast({
            //title: 'Deu erro ao criar!',
            description: message,
            status: 'error',
            position: 'bottom-right',
            isClosable: true,
          })
        })
      }
  
      const responseData = await response.json();
      if(responseData.status !== 0) {
        toast({
          title: 'Login feito com sucesso!',
          status: 'success',
          duration: 3000,
          position: 'bottom-right',
          isClosable: true,
        })
        //console.log('Resposta da API:', responseData);
        // Redireciona após o sucesso
        const storage = {
          user: responseData.user,
          token: responseData.token,
          data: new Date()
        }
        saveToLocalStorage('user_data_client', storage)
        _userContext?.setUser(responseData.user)
        //
        let newPermissions: any = []
        responseData.user.roles.forEach((role: any) => {
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
        _userContext?.setIsLoaded(true)
        getConfig(responseData.token)
        router.push('/feed/publicacoes');
      } else {
        toast({
          title: 'Deu erro ao logar!',
          description: responseData.message,
          status: 'error',
          position: 'bottom-right',
          isClosable: true,
        })
      }
      _modalContext.onCloseLoading()
      setIsLogin(false)
    } catch (error: any) {
      _modalContext.onCloseLoading()
      setIsLogin(false)
      console.error('Erro ao enviar requisição:', error);
    }
  };

  return (
      <main className="flex p-4">
        <div className="grid grid-cols-1 w-full">
          <div className="col-span-1 flex justify-center">
            <div className="bg-white shadow-lg rounded p-4 w-[500px] max-w-[90%]">
              <div className="grid grid-cols-1">
                <div className="col-span-1">
                  <h2 className="text-center text-2xl">Faça o login</h2>
                </div>

                <div className="col-span-1 mt-2">
                  <FormControl>
                    <FormLabel>Email:</FormLabel>
                    <Input onChange={handleEmailChange} type='email' placeholder="Digite seu email" bg="rgba(255, 255, 255, 0.8)" textColor="black" />
                  </FormControl>
                </div>

                <div className="col-span-1 mt-2">
                <FormControl>
                  <FormLabel>Senha</FormLabel>
                  <InputGroup size='md'>
                    <Input
                      pr='4.5rem'
                      type={show ? 'text' : 'password'}
                      placeholder='Digite sua senha'
                      bg="rgba(255, 255, 255, 0.8)" textColor="black"
                      value={userLogin.password}
                      onChange={handlePasswordChange}
                    />
                    <InputRightElement width='4.75rem'>
                      <Button h='1.75rem' size='sm' onClick={handleClick} className="mr-2">
                        {show ? 'Esconder' : 'Mostrar'}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                </div>

                <div className="col-span-1 mt-6">
                  <div className="flex items-center justify-end">
                    <Button onClick={loginUser} colorScheme='green' isLoading={isLogin} loadingText="Entrando..." className="mr-2">Entrar</Button>
                  </div>
                </div>

                <div className="col-span-1 mt-3 text-center">
                  <span className="text-[0.8rem]">Se ainda não tem conta, <div onClick={() => goRouter('/')} tabIndex={0} className="inline text-blue-600 font-semibold cursor-pointer">clique aqui</div> para se inscrever</span>
                </div>

              </div>
            </div>
          </div>
        </div>
      </main>
  );
}
