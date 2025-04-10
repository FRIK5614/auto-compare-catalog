
import React from "react";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

interface TextFormFieldProps { 
  name: string; 
  label: string; 
  placeholder: string;
}

const TextFormField = ({ 
  name, 
  label, 
  placeholder 
}: TextFormFieldProps) => {
  const { control } = useFormContext();
  
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input 
              placeholder={placeholder} 
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TextFormField;
