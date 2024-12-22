'use client'
import Image from "next/image";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  InputGroup,
  InputRightElement,
  Select,
  Tag,
  TagCloseButton,
  TagLabel,
  Wrap,
  WrapItem,
  useToast
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { FaPlusSquare } from "react-icons/fa";
import React, { useEffect, useState, useContext } from "react";
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import Link from 'next/link';
import { UserContext } from "@/app/context/UserContext";
import { getMyColors } from "@/app/utils/colors";
import ToolsMenu from "@/app/components/ToolsMenu";
import { ModalContext } from "@/app/context/ModalContext";
import { removeFromLocalStorage } from "@/app/utils/localStorage";
import { showToast } from "@/app/utils/chakra";

interface infoConfig {
  cpf: string;
  cnpj: string;
  money: string;
}

interface modelConfig {
  title: string;
  description: string;
  tags: string[];
  descriptionSite: string;
  titleSite: string;
  color1: string;
  color2: string;
  addressCity: string;
  addressCityId: string;
  addressState: string;
  addressStateId: string;
  addressZip: string;
  addressStreet: string;
  addressDistrict: string;
  phones: string[];
  emails: string[];
  info: infoConfig;
}

export default function Home() {
  const router = useRouter();
  const _userContext = useContext(UserContext);
  const _modalContext = useContext(ModalContext);
  const [tagCurrent, setTagCurrent] = useState<string>('');
  const [phoneCurrent, setPhoneCurrent] = useState<string>('');
  const [emailCurrent, setEmailCurrent] = useState<string>('');
  const [states, setStates] = useState<any[]>([])
  const [stateSelected, setStateSelected] = useState<any>();
  const [cities, setCities] = useState<any[]>([])
  const [citySelected, setCitySelected] = useState<any>();
  const toast = useToast();
  const [configModel, setConfigModel] = useState<modelConfig>({
    title: '',
    description: '',
    tags: [],
    descriptionSite: '',
    titleSite: '',
    color1: '',
    color2: '',
    addressCity: '',
    addressCityId: '',
    addressState: '',
    addressStateId: '',
    addressZip: '',
    addressStreet: '',
    addressDistrict: '',
    phones: [],
    emails: [],
    info: {
      cpf: '',
      cnpj: '',
      money: ''
    }
  });
  const colors = getMyColors()
  const [colorSelect, setColorSelect] = useState('')
  const [colorSelectTwo, setColorSelectTwo] = useState('')
  const [loading, setLoading] = useState<boolean>(true)
  const optionsToolsMenu: any = []

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setConfigModel({
      ...configModel,
      [name]: value
    });
  };
  const handleStateChange = (e: any) => {
    let inputValue = e.target.value
    let statesFilter = states.filter((state) => {
      return state.id === Number(inputValue)
    })
    setStateSelected(statesFilter[0])
    setConfigModel((prevState: any) => ({
      ...prevState,
      addressState: statesFilter[0].nome,
      addressStateId: statesFilter[0].id
    }));
    getCities(statesFilter[0].id)
  }
  const handleCityChange = (e: any) => {
    let inputValue = e.target.value
    let citiesFilter = cities.filter((city) => {
      return city.id === Number(inputValue)
    })
    setCitySelected(citiesFilter[0])
    setConfigModel((prevCity: any) => ({
      ...prevCity,
      addressCity: citiesFilter[0].nome,
      addressCityId: citiesFilter[0].id
    }));
  }
  const handleChangeTags = (e: any) => {
    if (e.key === 'Enter' || e.key === ' ' || e.keyCode === 13 || e.keyCode === 32) {
      let tag = e.target.value.trim(); // Remove espaços em branco nas extremidades
      if (tag && !configModel.tags.includes(tag)) {
        let tags = [...configModel.tags]; // Cria uma cópia do array de tags
        tags.push(tag);
        setConfigModel({
          ...configModel,
          tags: tags
        });
        setTagCurrent('');
      }
    }
  };
  const handleChangePhones = (e: any) => {
    if (e.key === 'Enter' || e.key === ' ' || e.keyCode === 13 || e.keyCode === 32) {
      let phone = e.target.value.trim(); // Remove espaços em branco nas extremidades
      if (phone && !configModel.phones.includes(phone)) {
        let phones = [...configModel.phones]; // Cria uma cópia do array de phones
        phones.push(phone);
        setConfigModel({
          ...configModel,
          phones: phones
        });
        setPhoneCurrent('');
      }
    }
  };  
  const handleChangeEmails = (e: any) => {
    if (e.key === 'Enter' || e.key === ' ' || e.keyCode === 13 || e.keyCode === 32) {
      let email = e.target.value.trim(); // Remove espaços em branco nas extremidades
      if (email && !configModel.emails.includes(email)) {
        let emails = [...configModel.emails]; // Cria uma cópia do array de emails
        emails.push(email);
        setConfigModel({
          ...configModel,
          emails: emails
        });
        setEmailCurrent('');
      }
    }
  };  
  const addTag = (type: string) => {
    if(type === 'tags') {
      if(tagCurrent) {
        let tags = configModel.tags
        if (!tags.includes(tagCurrent)) {
          tags.push(tagCurrent)
          setConfigModel({
            ...configModel,
            tags: tags
          })
          setTagCurrent('')
        }
      }
    } else if(type === 'phones') {
      if(phoneCurrent) {
        let phones = configModel.phones
        if (!phones.includes(phoneCurrent)) {
          phones.push(phoneCurrent)
          setConfigModel({
            ...configModel,
            phones: phones
          })
          setPhoneCurrent('')
        }
      }
    } else if(type === 'emails') {
      if(emailCurrent) {
        let emails = configModel.emails
        if (!emails.includes(emailCurrent)) {
          emails.push(emailCurrent)
          setConfigModel({
            ...configModel,
            emails: emails
          })
          setEmailCurrent('')
        }
      }
    }
  }
  const removeTag = (tag: any, indice: number, type: string) => {
    if(type === 'tags') {
      let newTags = [...configModel.tags]
      if(indice < configModel.tags.length) {
        newTags.splice(indice, 1)
        setConfigModel({
          ...configModel,
          tags: newTags
        })
      }
    } else if(type === 'phones') {
      let newPhones = [...configModel.phones]
      if(indice < configModel.phones.length) {
        newPhones.splice(indice, 1)
        setConfigModel({
          ...configModel,
          phones: newPhones
        })
      }
    } else if(type === 'emails') {
      let newEmails = [...configModel.emails]
      if(indice < configModel.emails.length) {
        newEmails.splice(indice, 1)
        setConfigModel({
          ...configModel,
          emails: newEmails
        })
      }
    }
  }

  const logout = () => {
    removeFromLocalStorage('user_data_client')
    _userContext?.setToken('')
    _userContext?.setUser({})
    router.push('/login')
  }

  const goRouter = (href: string) => {
    router.push(href)
  }

  const getConfig = async () => {
    try {
      const response = await fetch('https://backend-my-site.onrender.com/config/1', {
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
      if(responseData.data.config.addressStateId) {
        getCities(responseData.data.config.addressStateId)
      }
      setConfigModel(responseData.data.config)
      setLoading(false)
      //console.log('Resposta da API:', responseData);
    } catch (error) {
      console.error('Erro ao enviar requisição:', error);
    }
  };

  const createConfigFetch = async () => {
    try {
      _modalContext.onOpenLoading()
      const response = await fetch('https://backend-my-site.onrender.com/config/1', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json', // Tipo de conteúdo que você está enviando
          'Authorization': `Bearer ${_userContext?.token}`,
        },
        body: JSON.stringify(configModel),
      });
      
      if (!response.ok) {
        const responseData = await response.json();
        _modalContext.onCloseLoading()
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
      _modalContext.onCloseLoading()
      //router.push('/feed/curriculos')
      //console.log('Resposta da API:', responseData);
      //router.push('/jogadores')
    } catch (error) {
      _modalContext.onCloseLoading()
      console.error('Erro ao enviar requisição:', error);
    }
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

  const changeColor = (color: string, mode: number) => {
    if(mode === 1) {
      setConfigModel({
        ...configModel,
        color1: color
      })
    } else if(mode === 2) {
      setConfigModel({
        ...configModel,
        color2: color
      })
    }
  }

  useEffect(() => {
    //getLanguagensFetch()
    getStates()
    getConfig()
  }, [])

  return (
    <main className="flex w-full p-4">
      <div className="grid grid-cols-1 w-full">

        <div className="col-span-1 bg-white shadow-lg rounded p-2">
          <div className="flex items-center justify-between">
            <Breadcrumb spacing='4px' separator={<ChevronRightIcon w={5} h={5} color='black' />}>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink color="black">Configuração</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
            <div className="flex items-center">
              <ToolsMenu options={optionsToolsMenu} />
            </div>
          </div>
        </div>

        <div className="col-span-1 mt-4">
          <h1 className="mb-0 text-xl lg:text-2xl">Configuração</h1>
        </div>

        <div className="col-span-1 mt-4 bg-white shadow-lg rounded p-3">
          <div className="flex flex-col items-start">
            <Button onClick={() => goRouter('/feed/configuracao/logs')} colorScheme="green">
              Ver logs
            </Button>
          </div>
        </div>

        <div className="col-span-1 mt-4 bg-white shadow-lg rounded p-3">
          <div className="grid grid-cols-1">
            <div className="col-span-1">
              <h2 className="text-xl">Configurações iniciais</h2>
            </div>
            <div className="col-span-1">
              <FormControl>
                <FormLabel>Título:</FormLabel>
                <Input type='text' name="title" bg="rgba(255, 255, 255, 0.8)" textColor="black" max="23" value={configModel.title} onChange={handleChange} />
              </FormControl>
            </div>
            <div className="col-span-1">
              <FormControl>
                <FormLabel>Título do site:</FormLabel>
                <Input type='text' name="titleSite" bg="rgba(255, 255, 255, 0.8)" textColor="black" max="23" value={configModel.titleSite} onChange={handleChange} />
              </FormControl>
            </div>
            <div className="col-span-1 mt-2">
              <FormControl isRequired>
                <FormLabel>Descrição:</FormLabel>
                <Textarea
                  value={configModel.description}
                  name="description"
                  onChange={handleChange}
                  placeholder='Digite a sua descrição'
                  size='sm'
                  height="100px"
                  bg="rgba(255, 255, 255, 0.8)" textColor="black"
                />
              </FormControl>
            </div>
            <div className="col-span-1 mt-2">
              <FormControl isRequired>
                <FormLabel>Descrição do site:</FormLabel>
                <Textarea
                  value={configModel.descriptionSite}
                  onChange={handleChange}
                  name="descriptionSite"
                  placeholder='Digite a sua descrição'
                  size='sm'
                  height="100px"
                  bg="rgba(255, 255, 255, 0.8)" textColor="black"
                />
              </FormControl>
            </div>
            <div className="col-span-1 mt-2">
              <div className="grid grid-cols-1">
                <div className="col-span-1">
                  <FormControl>
                    <FormLabel>Tags:</FormLabel>
                    <InputGroup size='md'>
                      <Input
                        pr='4.5rem'
                        type="text"
                        placeholder='Digite uma tag e aperte enter'
                        onKeyDown={handleChangeTags}
                        onChange={(value: any) => setTagCurrent(value.target.value)}
                        value={tagCurrent}
                      />
                      <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={() => addTag('tags')} colorScheme="teal">
                        <FaPlusSquare />
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                </div>
                <div className="col-span-1 mt-3">
                  <Wrap spacing={2}>
                    {configModel.tags.map((tag: any, indice: any) => (
                      <WrapItem key={indice}>
                        <Tag
                          size="md"
                          borderRadius="full"
                          variant="solid"
                          colorScheme="teal"
                        >
                          <TagLabel>{tag}</TagLabel>
                          <TagCloseButton onClick={() => removeTag(tag, indice, 'tags')} />
                        </Tag>
                      </WrapItem>
                    ))}
                  </Wrap>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-1 mt-4 bg-white shadow-lg rounded p-3">
          <div className="grid grid-cols-1">
            <div className="col-span-1">
              <h2 className="text-xl">Endereço</h2>
            </div>
            <div className="col-span-1">
              <FormControl>
                <FormLabel>CEP:</FormLabel>
                <Input type='text' name="addressZip" bg="rgba(255, 255, 255, 0.8)" textColor="black" max="23" value={configModel.addressZip} onChange={handleChange} />
              </FormControl>
            </div>
            <div className="col-span-1 mt-2">
              <FormControl>
                <FormLabel>Rua:</FormLabel>
                <Input type='text' name="addressStreet" bg="rgba(255, 255, 255, 0.8)" textColor="black" max="23" value={configModel.addressStreet} onChange={handleChange} />
              </FormControl>
            </div>
            <div className="col-span-1 mt-2">
              <FormControl>
                <FormLabel>Bairro:</FormLabel>
                <Input type='text' name="addressDistrict" bg="rgba(255, 255, 255, 0.8)" textColor="black" max="23" value={configModel.addressDistrict} onChange={handleChange} />
              </FormControl>
            </div>
            <div className="col-span-1 mt-2">
            <FormControl>
              <FormLabel>Estado:</FormLabel>
              <Select onChange={handleStateChange} value={configModel.addressStateId} placeholder='Selecione um estado' bg="rgba(255, 255, 255, 0.8)" textColor="black" iconColor="black" ringColor="black">
                {states.map((state: any, index: any) => (
                  <option value={state.id} key={index}>{state.nome}</option>
                ))}
              </Select>
            </FormControl>
            </div>
            <div className="col-span-1 mt-2">
            <FormControl>
              <FormLabel>Cidade:</FormLabel>
              <Select onChange={handleCityChange} value={configModel.addressCityId} disabled={!cities.length ? true : false} placeholder='Selecione uma cidade' bg="rgba(255, 255, 255, 0.8)" textColor="black" iconColor="black" ringColor="black">
                {cities.map((city: any, index: any) => (
                  <option value={city.id} key={index}>{city.nome}</option>
                ))}
              </Select>
            </FormControl>
            </div>
          </div>
        </div>

        <div className="col-span-1 mt-4 bg-white shadow-lg rounded p-3">
          <div className="grid grid-cols-1">
            <div className="col-span-1">
              <div className="grid grid-cols-1">
                <div className="col-span-1 mt-2">
                  <div className="flex flex-col">
                    <span className="font-semibold">Defina a cor primária:</span>
                    <div className="grid grid-cols-4 md:grid-cols-6 xl:grid-cols-8 gap-2 mt-2">
                      {
                        colors.map((color: any, indice: any) => (
                          <button onClick={() => changeColor(color, 1)} key={indice} className={`col-span-1 h-[30px] rounded flex justify-center items-center ${colorSelect === color ? `bg-${color} border-2 border-black/75` : `bg-${color}`}`}>
                            {
                              configModel.color1 === color && <span className={`font-weight-600 text-[0.8rem] my-text-${color}`}>Ativo</span>
                            }
                          </button>
                        ))
                      }
                    </div>
                  </div>
                </div>

                <div className="col-span-1 mt-2">
                  <div className="flex flex-col">
                    <span className="font-semibold">Defina a cor secundaria:</span>
                    <div className="grid grid-cols-4 md:grid-cols-6 xl:grid-cols-8 gap-2 mt-2">
                      {
                        colors.map((color: any, indice: any) => (
                          <button onClick={() => changeColor(color, 2)} key={indice} className={`col-span-1 h-[30px] rounded flex justify-center items-center ${colorSelectTwo === color ? `bg-${color} border-2 border-black/75` : `bg-${color}`}`}>
                            {
                              configModel.color2 === color && <span className={`font-weight-600 text-[0.8rem] my-text-${color}`}>Ativo</span>
                            }
                          </button>
                        ))
                      }
                    </div>
                  </div>
                </div>

                <div className="col-span-1 mt-3">
                  <div className="grid grid-cols-1">
                    <div className="col-span-1">
                      <FormControl>
                        <FormLabel>Telefones:</FormLabel>
                        <InputGroup size='md'>
                          <Input
                            pr='4.5rem'
                            type="text"
                            placeholder='Digite um telefone e aperte enter'
                            onKeyDown={handleChangePhones}
                            onChange={(value: any) => setPhoneCurrent(value.target.value)}
                            value={phoneCurrent}
                          />
                          <InputRightElement width='4.5rem'>
                            <Button h='1.75rem' size='sm' onClick={() => addTag('phones')} colorScheme="teal">
                            <FaPlusSquare />
                            </Button>
                          </InputRightElement>
                        </InputGroup>
                      </FormControl>
                    </div>
                    <div className="col-span-1 mt-3">
                      <Wrap spacing={2}>
                        {configModel.phones.map((phone: any, indice: any) => (
                          <WrapItem key={indice}>
                            <Tag
                              size="md"
                              borderRadius="full"
                              variant="solid"
                              colorScheme="teal"
                            >
                              <TagLabel>{phone}</TagLabel>
                              <TagCloseButton onClick={() => removeTag(phone, indice, 'phones')} />
                            </Tag>
                          </WrapItem>
                        ))}
                      </Wrap>
                    </div>
                  </div>
                </div>

                <div className="col-span-1 mt-3">
                  <div className="grid grid-cols-1">
                    <div className="col-span-1">
                      <FormControl>
                        <FormLabel>E-mails:</FormLabel>
                        <InputGroup size='md'>
                          <Input
                            pr='4.5rem'
                            type="email"
                            placeholder='Digite um e-mail e aperte enter'
                            onKeyDown={handleChangeEmails}
                            onChange={(value: any) => setEmailCurrent(value.target.value)}
                            value={emailCurrent}
                          />
                          <InputRightElement width='4.5rem'>
                            <Button h='1.75rem' size='sm' onClick={() => addTag('emails')} colorScheme="teal">
                            <FaPlusSquare />
                            </Button>
                          </InputRightElement>
                        </InputGroup>
                      </FormControl>
                    </div>
                    <div className="col-span-1 mt-3">
                      <Wrap spacing={2}>
                        {configModel.emails.map((email: any, indice: any) => (
                          <WrapItem key={indice}>
                            <Tag
                              size="md"
                              borderRadius="full"
                              variant="solid"
                              colorScheme="teal"
                            >
                              <TagLabel>{email}</TagLabel>
                              <TagCloseButton onClick={() => removeTag(email, indice, 'emails')} />
                            </Tag>
                          </WrapItem>
                        ))}
                      </Wrap>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        <div className="col-span-1 mt-4 bg-white shadow-lg rounded p-3">
          <div className="grid grid-cols-1">
            <div className="col-span-1">
              <div className="flex items-center">
                <Button style={{ backgroundColor: "#718096", color: "white" }} className="mr-2">Limpar</Button>
                <Button onClick={createConfigFetch} colorScheme='green' className="mr-2">Criar</Button>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </main>
  );
}
