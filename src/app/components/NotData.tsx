'use client'
import React from 'react';
import { 
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';

const NotData = ({ status = 'info', title, description }: any) => {
  return (
    <Alert status={status}>
      <AlertIcon />
      <AlertTitle>{title}</AlertTitle>
      { description && <AlertDescription>{description}</AlertDescription> }
    </Alert>
  );
};

export default NotData;
