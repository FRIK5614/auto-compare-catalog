
import React from "react";
import { Car } from "@/types/car";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

interface CarFormBasicInfoProps {
  car: Car;
}

const CarFormBasicInfo = ({ car }: CarFormBasicInfoProps) => {
  const { control, formState: { errors } } = useFormContext();

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Основная информация</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Марка</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="BMW, Audi, Mercedes..." 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Модель</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="X5, A6, E-Class..." 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Год выпуска</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="2023" 
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
            name="price.base"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Цена</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="3000000" 
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
            name="bodyType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Тип кузова</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тип кузова" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Sedan">Седан</SelectItem>
                    <SelectItem value="SUV">Внедорожник</SelectItem>
                    <SelectItem value="Hatchback">Хэтчбек</SelectItem>
                    <SelectItem value="Coupe">Купе</SelectItem>
                    <SelectItem value="Wagon">Универсал</SelectItem>
                    <SelectItem value="Convertible">Кабриолет</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Страна</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите страну" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Германия">Германия</SelectItem>
                    <SelectItem value="Япония">Япония</SelectItem>
                    <SelectItem value="США">США</SelectItem>
                    <SelectItem value="Южная Корея">Южная Корея</SelectItem>
                    <SelectItem value="Франция">Франция</SelectItem>
                    <SelectItem value="Италия">Италия</SelectItem>
                    <SelectItem value="Великобритания">Великобритания</SelectItem>
                    <SelectItem value="Китай">Китай</SelectItem>
                    <SelectItem value="Россия">Россия</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Описание автомобиля..." 
                  rows={5}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="isNew"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Состояние</FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value ? "new" : "used"}
                  onValueChange={(value) => field.onChange(value === "new")}
                  className="flex space-x-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="new" id="new" />
                    <Label htmlFor="new">Новый</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="used" id="used" />
                    <Label htmlFor="used">С пробегом</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default CarFormBasicInfo;
