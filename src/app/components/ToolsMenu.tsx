import React from 'react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  IconButton,
  Avatar,
  Button,
  Tooltip
} from '@chakra-ui/react';
import { AddIcon, ExternalLinkIcon, RepeatIcon} from '@chakra-ui/icons';
import Link from 'next/link';
import { SlOptionsVertical } from "react-icons/sl";
import { useRouter } from 'next/navigation';


interface Props {
  options?: any
}

const ToolsMenu: React.FC<Props> = ({ options }: any) => {
  const router = useRouter()

  const navigation = (url: string) => {
    // função para mudar de página
  }

  const commit = (option: any) => {
    if(option.type === 'link') {
      router.push(option.link)
    } else if(option.type === 'function') {
      option.commit()
    }
  }
  const logout = () => {
    // função para deslogar
  }

  return (
    <Menu>
      <Tooltip label="Ferramentas">
      <MenuButton
        as={IconButton}
        aria-label='Ferramentas'
        icon={<SlOptionsVertical />}
        color="white"
        bg="orange.400"
        _hover={{ bg: 'orange.400' }}
        _expanded={{ bg: 'orange.400' }}
        isDisabled={options.length > 1 ? false : true}
      />
      </Tooltip>
      <MenuList>
        {
          options.map((option: any) => (
            <MenuItem onClick={() => commit(option)} icon={<AddIcon />}>
              Meu perfil
            </MenuItem>
          ))
        }
      </MenuList>
    </Menu>
  );
};

export default ToolsMenu;
