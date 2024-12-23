'use client'
import React, { useContext, useEffect, useRef } from "react";
import {
  Spinner
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { UserContext } from "./context/UserContext";
import { ConfigContext } from "./context/ConfigContext";
import { loadFromLocalStorage } from "./utils/localStorage";


export default function Home() {
  const _userContext = useContext(UserContext)
  const _configContext = useContext(ConfigContext)
  const router = useRouter()
  const isLogin = useRef(false)

  useEffect(() => {
    if(!isLogin.current) {
      const result = loadFromLocalStorage('user_data_client')
      if (result) {
        const { token, ...userWithoutToken } = result;
        _userContext?.setToken(token);
        _userContext?.setUser(userWithoutToken.user);
        //
        let newPermissions: any = []
        userWithoutToken.user.roles.forEach((role: any) => {
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
        const config = loadFromLocalStorage('config_data_client')
        if(config) {
          _configContext?.setConfig(config)
        }
        router.push('/feed/publicacoes')
      } else {
        router.push('/login');
      }
      isLogin.current = true
    }
  }, [])

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Spinner
        thickness='12px'
        speed='0.7s'
        emptyColor='gray.200'
        color='blue.500'
        width='140px'
        height='140px'
      />
    </div>
  );
}
