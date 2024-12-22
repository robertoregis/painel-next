import React, { useState, useEffect } from 'react';
import {
  Box,
  Checkbox,
  Wrap,
  CheckboxGroup
} from '@chakra-ui/react';

// 1. Create a component that consumes Checkbox props
const CheckboxCard = (props: any) => {
  return (
    <Box as='label'>
      <div className='flex items-center'>
        <Checkbox
          {...props}
          borderWidth='1px'
          borderRadius='md'
          boxShadow='md'
          _checked={{
            bg: 'teal.600',
            color: 'white',
            borderColor: 'teal.600',
          }}
          _focus={{
            boxShadow: 'outline',
          }}
          px={5}
          py={3}
          colorScheme="teal"
          size="sm"
          padding="8px"
        >
          {props.children}
        </Checkbox>
      </div>
    </Box>
  );
};

// Step 2: Use CheckboxGroup to control a group of custom checkboxes
const SelectData = ({ options, onChangeCheckbox, isMulti = false, limit = 5, optionsSelected }: any) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  useEffect(() => {
    if (optionsSelected.length > 0) {
      const optionsId = optionsSelected.map((option: any) => String(option.id));
      setSelectedValues(optionsId);
    }
  }, []);

  const handleCheckboxChange = (values: string[]) => {
    // Filtra os objetos do array `options` com base nos IDs em `values`
    const selectedOptions = options.filter((option: any) =>
      values.includes(String(option.id))
    );
  
    if (isMulti) {
      if (values.length <= limit) {
        setSelectedValues(values);
        onChangeCheckbox(selectedOptions); // Passa os objetos selecionados
      }
    } else {
      if (values.length <= 1) {
        setSelectedValues(values);
        onChangeCheckbox(selectedOptions); // Passa o objeto selecionado
      } else {
        // Considera o último valor selecionado se houver mais de um
        const lastSelectedValue = values[values.length - 1];
        const lastSelectedOption = options.find((option: any) => option.id === Number(lastSelectedValue));
  
        setSelectedValues([lastSelectedValue]);
        onChangeCheckbox([lastSelectedOption]); // Passa o objeto selecionado
      }
    }
  };
  

  return (
    <CheckboxGroup value={selectedValues} onChange={handleCheckboxChange}>
      <Wrap>
        {options.map((option: any) => (
          <CheckboxCard key={String(option.id)} value={String(option.id)}>
            {option.name}
          </CheckboxCard>
        ))}
      </Wrap>
    </CheckboxGroup>
  );
};

export default SelectData;



