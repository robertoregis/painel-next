'use client'
import Image from "next/image";
import {
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Checkbox,
  Textarea,
  InputGroup,
  InputRightElement,
  Select
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';


export default function Home() {
  const [show, setShow] = React.useState(false)
  const handleClick = () => setShow(!show)
  const [userLogin, setUserLogin] = useState<any>({
    email: null,
    password: null
  })
  const router = useRouter();
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
                    <Button colorScheme='green' className="mr-2">Entrar</Button>
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
