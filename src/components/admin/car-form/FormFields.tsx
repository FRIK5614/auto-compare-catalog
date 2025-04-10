
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

// Text input field
export const TextFormField = ({ 
  name, 
  label, 
  placeholder 
}: { 
  name: string; 
  label: string; 
  placeholder: string;
}) => {
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

// Number input field
export const NumberFormField = ({ 
  name, 
  label, 
  placeholder,
  step
}: { 
  name: string; 
  label: string; 
  placeholder: string;
  step?: string;
}) => {
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

// Textarea field
export const TextareaFormField = ({ 
  name, 
  label, 
  placeholder,
  rows = 5 
}: { 
  name: string; 
  label: string; 
  placeholder: string;
  rows?: number;
}) => {
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

// Select field
export const SelectFormField = ({ 
  name, 
  label, 
  placeholder,
  options
}: { 
  name: string; 
  label: string; 
  placeholder: string;
  options: { value: string; label: string }[];
}) => {
  const { control } = useFormContext();
  
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map(option => (
                <SelectItem key={option.value} value={option.value}>
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

// Radio group field
export const RadioGroupFormField = ({ 
  name, 
  label,
  options
}: { 
  name: string; 
  label: string; 
  options: { value: string; label: string }[];
}) => {
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
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value}>{option.label}</Label>
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

// Boolean radio group field (special case for true/false values)
export const BooleanRadioFormField = ({ 
  name, 
  label,
  trueLabel = "Да",
  falseLabel = "Нет"
}: { 
  name: string; 
  label: string; 
  trueLabel?: string;
  falseLabel?: string;
}) => {
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
