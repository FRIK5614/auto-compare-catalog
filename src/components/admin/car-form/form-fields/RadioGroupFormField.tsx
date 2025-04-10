
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupFormFieldProps { 
  name: string; 
  label: string; 
  options: RadioOption[];
}

const RadioGroupFormField = ({ 
  name, 
  label,
  options
}: RadioGroupFormFieldProps) => {
  const { control } = useFormContext();
  
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <RadioGroup
              value={field.value}
              onValueChange={field.onChange}
              className="flex space-x-4 mt-2"
            >
              {options.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`${name}-${option.value}`} />
                  <Label htmlFor={`${name}-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default RadioGroupFormField;
