'use client'

import React, { useState, useContext, useEffect } from 'react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  useToast
} from '@chakra-ui/react';
import { MdNavigation, MdLogout } from "react-icons/md";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserContext } from '../context/UserContext';
import { removeFromLocalStorage } from '../utils/localStorage';

const UserMenu: React.FC<any> = () => {
  const router = useRouter()
  const _userContext = useContext(UserContext)
  const toast = useToast()

  const navigation = (url: string) => {
    router.push(url)
  }
  const logout = () => {
    // função para deslogar
    removeFromLocalStorage('user_data_client')
    _userContext?.setToken('')
    _userContext?.setUser({})
    toast({
      title: null,
      description: "Você acabou de sair da sua conta",
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
    router.push('/login')
  }

  useEffect(() => {
    console.log(_userContext?.user)
  }, [])

  return (
    <Menu>
      <MenuButton
        as={Avatar}
        aria-label='Options'
        src={_userContext?.user.imageUrl}
        variant='outline'
        role='dialog'
        tabIndex={0}
        size="sm"
        style={{ cursor: 'pointer' }}
      />
      <MenuList>
        <MenuItem onClick={() => navigation('/feed')} icon={<MdNavigation />}>
          Meu perfil
        </MenuItem>
        <MenuItem onClick={() => navigation('/feed/avisos')} icon={<MdNavigation />}>
          Meus avisos
        </MenuItem>
        <MenuItem onClick={logout} icon={<MdLogout />}>
          Sair
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default UserMenu;
