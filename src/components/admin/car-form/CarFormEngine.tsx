
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

interface CarFormEngineProps {
  car: Car;
}

const CarFormEngine = ({ car }: CarFormEngineProps) => {
  const { control } = useFormContext();

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Двигатель</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={control}
          name="engine.type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Тип двигателя</FormLabel>
              <FormControl>
                <Input 
                  placeholder="V6, Inline-4..." 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="engine.displacement"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Объем (л)</FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  placeholder="2.0" 
                  step="0.1"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="engine.fuelType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Тип топлива</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип топлива" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Petrol">Бензин</SelectItem>
                  <SelectItem value="Diesel">Дизель</SelectItem>
                  <SelectItem value="Hybrid">Гибрид</SelectItem>
                  <SelectItem value="Electric">Электро</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="engine.power"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Мощность (л.с.)</FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  placeholder="180" 
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
          name="engine.torque"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Крутящий момент (Нм)</FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  placeholder="350" 
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default CarFormEngine;
