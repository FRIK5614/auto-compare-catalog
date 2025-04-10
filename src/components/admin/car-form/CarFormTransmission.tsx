
import React from "react";
import { Car } from "@/types/car";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

interface CarFormTransmissionProps {
  car: Car;
}

const CarFormTransmission = ({ car }: CarFormTransmissionProps) => {
  const { control } = useFormContext();

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Трансмиссия</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={control}
          name="transmission.type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Тип трансмиссии</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип трансмиссии" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Automatic">Автомат</SelectItem>
                  <SelectItem value="Manual">Механика</SelectItem>
                  <SelectItem value="CVT">Вариатор</SelectItem>
                  <SelectItem value="DCT">Робот</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="transmission.gears"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Количество передач</FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  placeholder="7" 
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="drivetrain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Привод</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип привода" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="FWD">Передний</SelectItem>
                  <SelectItem value="RWD">Задний</SelectItem>
                  <SelectItem value="AWD">Полный</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default CarFormTransmission;
