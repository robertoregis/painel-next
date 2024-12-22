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
  useToast
} from '@chakra-ui/react';
import Link from 'next/link';
import Select from 'react-select';
import { ChevronRightIcon } from '@chakra-ui/icons';
import React, { useEffect, useState, useContext } from "react";
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { UserContext } from '@/app/context/UserContext';
import ToolsMenu from '@/app/components/ToolsMenu';
import { showToast } from '@/app/utils/chakra';
import { removeFromLocalStorage } from '@/app/utils/localStorage';
import { ModalContext } from '@/app/context/ModalContext';

const options = [
  { value: 'all', label: 'Todas' },
  { value: 'users', label: 'Usuários' },
  { value: 'roles', label: 'Regras' },
  { value: 'posts', label: 'Publicações' },
  { value: 'frameworks', label: 'Frameworks' },
  { value: 'warnings', label: 'Avisos' },
  { value: 'jobs', label: 'Trabalhos' },
  { value: 'languagens', label: 'Linguagens' },
  { value: 'curriculuns', label: 'Currículos' },
];

export default function Home() {
  const [roleModel, setRoleModel] = useState<any>({
    name: null,
    permissions: [],
  })
  const _userContext = useContext(UserContext);
  const _modalContext = useContext(ModalContext);
  const router = useRouter();
  const params = useParams();
  const toast = useToast();
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState<boolean>(false)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const optionsToolsMenu: any = []

  const handleNameChange = (e: any) => {
    let inputValue = e.target.value
    setRoleModel((prevState: any) => ({
      ...prevState,
      name: inputValue
    }));
  }
  const handlePermissionsChange = (value: any) => {
    setRoleModel((prevState: any) => ({
      ...prevState,
      permissions: value
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

  const createRoleFetch = async () => {
    setIsCreating(true)
    try {
      _modalContext.onOpenLoading()
      const response = await fetch('https://backend-my-site.onrender.com/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Tipo de conteúdo que você está enviando
          'Authorization': `Bearer ${_userContext?.token}`,
        },
        body: JSON.stringify(roleModel),
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
        router.push('/feed/regras');
      } else {
        showToast({
          description: responseData.message,
          status: 'error'
        }, toast);
      }
      _modalContext.onCloseLoading()
      setIsCreating(false)
      //console.log('Resposta da API:', responseData);
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

  const getRoleFetch = async () => {
    try {
      const response = await fetch(`https://backend-my-site.onrender.com/roles/${params.slug[1]}`, {
        method: 'GET',
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
        setRoleModel(responseData.data.role)
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

  const updateRole = async () => {
    try {
      _modalContext.onOpenLoading()
      const roleUpdate = {
        name: roleModel.name,
        permissions: roleModel.permissions
      }
      const response = await fetch(`https://backend-my-site.onrender.com/roles/${params.slug[1]}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json', // Tipo de conteúdo que você está enviando
          'Authorization': `Bearer ${_userContext?.token}`,
        },
        body: JSON.stringify(roleUpdate),
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
      //console.log('Resposta da API:', responseData);
      router.push('/feed/regras')
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
      createRoleFetch()
    } else {
      updateRole()
    }
  }

  useEffect(() => {
    setIsEditing(params.slug[0] === 'criar' ? false : true)
    if(params.slug[0] === 'criar') {
      setLoading(false)
    } else {
      getRoleFetch()
    }
  }, [])

  return (
    <main className="flex w-full p-4">
      <div className="grid grid-cols-1 w-full">
        <div className="col-span-1 bg-white shadow-lg rounded p-2">
        <div className="flex items-center justify-between">
          <Breadcrumb spacing='4px' separator={<ChevronRightIcon w={5} h={5} color='black' />}>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => goRouter('/feed/regras')} color="black">Regras</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink color="black">{isEditing ? `Editar` : `Criar`} regra</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          <div className="flex items-center">
            <ToolsMenu options={optionsToolsMenu} />
          </div>
        </div>
        </div>
        <div className="col-span-1 mt-4">
          <h1 className="mb-0 text-xl lg:text-2xl">{isEditing ? `Editar` : `Criar`} regra</h1>
        </div>
        <div className="col-span-1 mt-4 bg-white shadow-lg rounded p-3">
          <p className="mb-0">Vamos {isEditing ? `editar` : `criar`} uma regra</p>
        </div>
        <div className="col-span-1 mt-4 bg-white shadow-lg rounded p-3">
          <div className="grid grid-cols-1">

            <div className="col-span-1">
              <FormControl>
                <FormLabel>Nome:</FormLabel>
                <Input type='text'  bg="rgba(255, 255, 255, 0.8)" textColor="black" max="23" value={roleModel.name} onChange={handleNameChange} />
                <FormHelperText>É preciso escolher um nome.</FormHelperText>
              </FormControl>
            </div>
            <div className="col-span-1 mt-2">
            <FormControl>
              <FormLabel>Permissões:</FormLabel>
              <Select
                isMulti
                options={options}
                onChange={handlePermissionsChange}
                placeholder='Selecione'
                noOptionsMessage={() => 'Nenhuma opção disponível'}
                value={roleModel.permissions}
              />
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