
import { z } from "zod";

export const carFormSchema = z.object({
  brand: z.string().min(1, { message: "Укажите марку автомобиля" }),
  model: z.string().min(1, { message: "Укажите модель автомобиля" }),
  year: z.number().min(1900, { message: "Год должен быть больше 1900" }).max(new Date().getFullYear() + 1, { message: "Год не может быть в будущем" }),
  bodyType: z.string().min(1, { message: "Выберите тип кузова" }),
  country: z.string().min(1, { message: "Выберите страну производителя" }),
  price: z.object({
    base: z.number().min(1, { message: "Укажите базовую стоимость" }),
  }),
  description: z.string().optional(),
  isNew: z.boolean(),
  engine: z.object({
    type: z.string().min(1, { message: "Укажите тип двигателя" }),
    displacement: z.number().min(0.1, { message: "Объем двигателя должен быть больше 0" }),
    power: z.number().min(1, { message: "Мощность двигателя должна быть больше 0" }),
    torque: z.number().min(1, { message: "Крутящий момент должен быть больше 0" }),
    fuelType: z.string().min(1, { message: "Выберите тип топлива" }),
  }),
  transmission: z.object({
    type: z.string().min(1, { message: "Выберите тип трансмиссии" }),
    gears: z.number().min(1, { message: "Количество передач должно быть больше 0" }),
  }),
  drivetrain: z.string().min(1, { message: "Выберите тип привода" }),
});

export type CarFormValues = z.infer<typeof carFormSchema>;

export const mapCarToFormValues = (car: any): CarFormValues => {
  return {
    brand: car.brand || "",
    model: car.model || "",
    year: car.year || new Date().getFullYear(),
    bodyType: car.bodyType || "",
    country: car.country || "",
    price: {
      base: car.price?.base || 0,
    },
    description: car.description || "",
    isNew: car.isNew || false,
    engine: {
      type: car.engine?.type || "",
      displacement: car.engine?.displacement || 0,
      power: car.engine?.power || 0,
      torque: car.engine?.torque || 0,
      fuelType: car.engine?.fuelType || "",
    },
    transmission: {
      type: car.transmission?.type || "",
      gears: car.transmission?.gears || 0,
    },
    drivetrain: car.drivetrain || "",
  };
};

export const mapFormValuesToCar = (values: CarFormValues, car: any, imageUrl?: string): any => {
  const updatedCar = { ...car };
  
  // Update basic information
  updatedCar.brand = values.brand;
  updatedCar.model = values.model;
  updatedCar.year = values.year;
  updatedCar.bodyType = values.bodyType;
  updatedCar.country = values.country;
  updatedCar.price.base = values.price.base;
  updatedCar.description = values.description;
  updatedCar.isNew = values.isNew;
  
  // Update engine details
  updatedCar.engine = {
    ...updatedCar.engine,
    type: values.engine.type,
    displacement: values.engine.displacement,
    power: values.engine.power,
    torque: values.engine.torque,
    fuelType: values.engine.fuelType,
  };
  
  // Update transmission details
  updatedCar.transmission = {
    ...updatedCar.transmission,
    type: values.transmission.type,
    gears: values.transmission.gears,
  };
  
  updatedCar.drivetrain = values.drivetrain;
  
  // Update image if provided
  if (imageUrl) {
    if (updatedCar.images && updatedCar.images.length > 0) {
      updatedCar.images[0].url = imageUrl;
    } else {
      updatedCar.images = [
        {
          id: updatedCar.id,
          url: imageUrl,
          alt: `${values.brand} ${values.model}`,
        }
      ];
    }
    
    // For legacy compatibility
    updatedCar.image_url = imageUrl;
  }
  
  return updatedCar;
};
