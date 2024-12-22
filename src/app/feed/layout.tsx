'use client'

import React, { useEffect, useState, useContext, useRef } from "react";
import Navbar from "../components/Navbar";
import Main from "../components/Main";
import { UserContext } from "../context/UserContext";
import { ConfigContext } from '../context/ConfigContext';
import { loadFromLocalStorage, removeFromLocalStorage, saveToLocalStorage } from "../utils/localStorage";
import { useRouter } from 'next/navigation';
import Loading from "../components/Loading";

export default function FeedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const _userContext = useContext(UserContext)
  const _configContext = useContext(ConfigContext)
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()
  const isLogin = useRef(false)
  const optionsToolsMenu: any = []

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

  const getUserFetch = async (userId: string, token: string) => {
    try {
      const response = await fetch(`https://backend-my-site.onrender.com/users/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json', // Tipo de conteúdo que você está enviando
          'Authorization': `Bearer ${token}`,
        }
      });
      const responseData = await response.json();
      if(responseData.status !== 0) {
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
        const storage = {
          user: responseData.data.user,
          token: token,
          data: new Date()
        }
        saveToLocalStorage('user_data_client', storage)
        //console.log(responseData.data.user)
      }
    } catch (error) {
      console.error('Request Error: An issue occurred', error);
    }
  };

  useEffect(() => {
    if(!isLogin.current) {
      const result = loadFromLocalStorage('user_data_client')
      getConfig(result.token)
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
        setLoading(false)
        setTimeout(() => {
          getUserFetch(userWithoutToken.user.id, token)
        }, 500)
      } else {
        router.push('/login');
      }
      isLogin.current = true
    }
  }, [])

  if(!loading) {
    return (
      <div className="flex justify-center items-center">
        <div className="w-full mx-auto flex h-screen shadow-lg">
          <Navbar />
          <Main children={children} />
        </div>
        <Loading />
      </div>
    );
  }
}
