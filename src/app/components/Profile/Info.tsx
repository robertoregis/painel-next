'use client'
import Image from "next/image";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  InputGroup,
  InputRightElement,
  Select,
  FormHelperText,
  Checkbox,
  useToast,
  SkeletonText
} from '@chakra-ui/react';
import CropImage from '@/app/components/CropImage';
import ShowImage from '@/app/components/ShowImage';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { FaPlusSquare } from "react-icons/fa";
import React, { useEffect, useState, useContext } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserContext } from "@/app/context/UserContext";
import { showToast } from "@/app/utils/chakra";


interface Props {
  user: any,
  onChangeUser?: () => void;
}

const ProfileInfo: React.FC<Props> = ({ user }) => {
  const router = useRouter();
  const _userContext = useContext(UserContext)
  const [states, setStates] = useState<any[]>([])
  const [stateSelected, setStateSelected] = useState<any>();
  const [cities, setCities] = useState<any[]>([])
  const [citySelected, setCitySelected] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true)
  const [userModel, setUserModel] = useState<any>({
    username: null,
    password: null,
    email: null,
    city: null,
    cityId: '',
    state: null,
    stateId: ''
  })
  const [imageSrc, setImageSrc] = useState('');
  const [isImage, setIsImage] = useState<boolean>(false)
  const [file, setFile] = useState<any>()
  const toast = useToast()
  const [aspect, setAspect] = useState(4 / 4); // Valor padrão

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
      const formData = new FormData();
      // Adiciona o arquivo ao FormData com o nome 'file'
      if(file) formData.append('file', file);
      const userFields = ['username', 'email', 'city', 'state', 'cityId', 'stateId'];
      userFields.forEach(field => {
        if (userModel[field]) {
          formData.append(field, userModel[field]);
        }
      });
      const response = await fetch(`https://backend-my-site.onrender.com/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${_userContext?.token}`,
        },
        body: formData,
      });
      
      if (!response.ok) {
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
    } catch (error) {
      toast({
        title: null,
        description: "Não foi possível atualizar o usuário",
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  useEffect(() => {
    getStates()
    if(user) {
      if(user.stateId) {
        getCities(user.stateId)
      } else {
        getStates()
      }
      if(user.imageUrl) {
        setImageSrc(user.imageUrl)
        setIsImage(true)
      }
    }
  })

  return (
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
            <div className="col-span-1 mt-4">
              <div className="flex items-center">
                <Button style={{ backgroundColor: "#718096", color: "white" }} className="mr-2">Limpar</Button>
                <Button onClick={() => updateUser} colorScheme='green' className="mr-2">Salvar</Button>
              </div>
            </div>

          </div>
        </div>
  );
};

export default ProfileInfo;
