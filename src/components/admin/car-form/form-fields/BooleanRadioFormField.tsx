
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

interface BooleanRadioFormFieldProps { 
  name: string; 
  label: string; 
  trueLabel?: string;
  falseLabel?: string;
}

const BooleanRadioFormField = ({ 
  name, 
  label,
  trueLabel = "Да",
  falseLabel = "Нет"
}: BooleanRadioFormFieldProps) => {
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
              value={field.value ? "true" : "false"}
              onValueChange={(value) => field.onChange(value === "true")}
              className="flex space-x-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id={`${name}-true`} />
                <Label htmlFor={`${name}-true`}>{trueLabel}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id={`${name}-false`} />
                <Label htmlFor={`${name}-false`}>{falseLabel}</Label>
              </div>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default BooleanRadioFormField;
