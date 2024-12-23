import {
  IconButton,
  Popover,
  PopoverBody,
  PopoverTrigger,
  PopoverContent,
  Stack,
  Card,
  CardHeader,
  useDisclosure
} from '@chakra-ui/react';
import { AiFillAlert } from "react-icons/ai";
import Link from 'next/link';
import React, { useState } from 'react';

interface Props {
  title?: string;
  text?: string;
}

const WarningsQuickStats: React.FC<Props> = ({ title, text }) => {

  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleCardClick = () => {
    onClose(); // Fecha o Popover
  };

  const [warnings, setWarnings] = useState<any>([
    {
        id: 1,
        title: '',
        description: '',
        type: ''
    },
    {
        id: 2,
        title: '',
        description: '',
        type: ''
    },
    {
        id: 3,
        title: '',
        description: '',
        type: ''
    },
  ])

  return (
    <Popover placement='bottom-end' isOpen={isOpen} onClose={onClose}>
      <PopoverTrigger>
        <IconButton
          isRound={true}
          aria-label='Done'
          icon={<AiFillAlert className="text-xl" />}
          bg="transparent"
          _hover={{ bg: "transparent" }}
          size="sm"
          onClick={onOpen}
        />
      </PopoverTrigger>
      <PopoverContent maxW="400px">
        <PopoverBody className="flex justify-center">
          <Stack className='w-full'>
            {warnings.map((warning: any) => (
              <Link href="/feed/avisos" key={warning.id}>
              <Card size="sm" onClick={handleCardClick}>
                  <CardHeader padding="4px">
                      <div className="flex flex-col">
                        <span className="text-[1.1rem] font-[600] mb-1">Título</span>
                        <span className="text-[0.75rem]">20h29 - 24/06/2024</span>
                      </div>
                  </CardHeader>
              </Card>
              </Link>
            ))}
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default WarningsQuickStats;
