
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

interface TextareaFormFieldProps { 
  name: string; 
  label: string; 
  placeholder: string;
  rows?: number;
}

const TextareaFormField = ({ 
  name, 
  label, 
  placeholder,
  rows = 5 
}: TextareaFormFieldProps) => {
  const { control } = useFormContext();
  
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea 
              placeholder={placeholder} 
              rows={rows}
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TextareaFormField;
