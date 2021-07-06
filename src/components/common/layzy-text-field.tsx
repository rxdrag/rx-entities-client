import React from 'react';
import { TextField } from '@material-ui/core';
import { useState } from 'react';
import { useEffect } from 'react';

export interface PropsInputProps{
  autoFocus?:boolean,
  label?:string;
  value:any;
  onChange:(value:string)=>void;
  size?:string;
  disabled?: boolean;
}

export default function LayzyTextField(props:PropsInputProps){
  const {label, value, onChange, disabled, size = 'small', ...rest} = props;
  const [inputValue, setInputValue] = useState<any>();

  useEffect(()=>{
    setInputValue(value);
  },[value])

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    let newValue = (event.target.value as string).trim();
    setInputValue(newValue);
  }; 

  const handleFinishEdit = ()=>{
    onChange(inputValue);  
  }

  return (
    <TextField
      label={label}
      value={inputValue || ''}
      onChange={handleChange}
      onBlur = {handleFinishEdit}
      size={size as any}
      fullWidth
      disabled = {disabled}
      variant = "outlined"
      onKeyUp = {e=>{
        if(e.key === 'Enter') {
          handleFinishEdit()
        }
      }
    }
      {...rest}
    />
  )
}
