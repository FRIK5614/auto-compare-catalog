
import React from "react";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

interface NumberFormFieldProps { 
  name: string; 
  label: string; 
  placeholder: string;
  step?: string;
}

const NumberFormField = ({ 
  name, 
  label, 
  placeholder,
  step
}: NumberFormFieldProps) => {
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
              type="number" 
              placeholder={placeholder} 
              step={step}
              {...field}
              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
              value={field.value}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default NumberFormField;
