
import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

interface NumberFormFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
}

const NumberFormField = ({
  name,
  label,
  placeholder = "",
  min = 0,
  max,
  step = 1,
  required = false,
}: NumberFormFieldProps) => {
  const { control, setValue } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // Convert value to string for the input, empty string if null or undefined
        const inputValue = field.value !== null && field.value !== undefined ? field.value.toString() : '';
        
        return (
          <FormItem className="space-y-1">
            <FormLabel>{label}{required && <span className="text-destructive ml-1">*</span>}</FormLabel>
            <FormControl>
              <Input
                type="text"
                inputMode="decimal"
                placeholder={placeholder}
                value={inputValue}
                onChange={(e) => {
                  // Allow empty input (will be converted to default value on submit)
                  if (e.target.value === '') {
                    field.onChange('');
                    return;
                  }
                  
                  // Handle number input with decimal support
                  const regex = /^-?\d*\.?\d*$/;
                  if (regex.test(e.target.value)) {
                    const numValue = parseFloat(e.target.value);
                    
                    // Only validate if it's a valid number
                    if (!isNaN(numValue)) {
                      // Apply min/max constraints only for valid numbers
                      if (min !== undefined && numValue < min) {
                        field.onChange(min);
                        return;
                      }
                      
                      if (max !== undefined && numValue > max) {
                        field.onChange(max);
                        return;
                      }
                    }
                    
                    // Pass the string value to allow for partial input like "1."
                    field.onChange(e.target.value);
                  }
                }}
                onBlur={() => {
                  // On blur, convert to number or default value
                  if (field.value === '' || field.value === null || field.value === undefined) {
                    field.onChange(min || 0);
                  } else if (typeof field.value === 'string') {
                    const numValue = parseFloat(field.value);
                    if (!isNaN(numValue)) {
                      field.onChange(numValue);
                    } else {
                      field.onChange(min || 0);
                    }
                  }
                }}
                className="w-full"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default NumberFormField;
