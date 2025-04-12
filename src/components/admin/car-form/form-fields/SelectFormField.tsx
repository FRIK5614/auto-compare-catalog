
import React from "react";
import { useFormContext } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFormFieldProps { 
  name: string; 
  label: string; 
  placeholder: string;
  options: SelectOption[];
}

const SelectFormField = ({ 
  name, 
  label, 
  placeholder,
  options
}: SelectFormFieldProps) => {
  const { control, setValue } = useFormContext();
  
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-1">
          <FormLabel>{label}</FormLabel>
          <Select 
            onValueChange={(value) => {
              field.onChange(value);
              // Trigger any validation or dependent fields if needed
              console.log(`Selected ${name}: ${value}`);
            }} 
            defaultValue={field.value || ""}
            value={field.value || ""}
          >
            <FormControl>
              <SelectTrigger className="w-full bg-white focus:bg-white">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-white">
              {options.map(option => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  className="cursor-pointer"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SelectFormField;
