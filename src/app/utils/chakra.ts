import { useToast } from '@chakra-ui/react';

export const showToast = (options: any, toast: any) => {
  toast({
    title: options.title ? options.title : '',
    description: options.description ? options.description : '',
    status: options.status,
    duration: options.duration ? options.duration : 3000,
    isClosable: options.isClosable ? options.isClosable : true,
    position: options.position ? options.position : 'bottom-right',
  });
};