
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { useCars } from '@/hooks/useCars';
import { Car, CarFeature, CarImage } from '@/types/car';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';

// Create schema for form validation
const carFormSchema = z.object({
  brand: z.string().min(1, { message: 'Бренд обязателен' }),
  model: z.string().min(1, { message: 'Модель обязательна' }),
  year: z.coerce.number().int().min(1900).max(new Date().getFullYear() + 1),
  bodyType: z.string().min(1, { message: 'Тип кузова обязателен' }),
  price: z.coerce.number().positive({ message: 'Цена должна быть положительной' }),
  country: z.string().optional(),
  description: z.string().min(10, { message: 'Добавьте более подробное описание' }),
  isNew: z.boolean().default(false),
  engineType: z.string().min(1, { message: 'Тип двигателя обязателен' }),
  engineDisplacement: z.coerce.number().positive(),
  enginePower: z.coerce.number().positive(),
  engineTorque: z.coerce.number().positive(),
  engineFuelType: z.string().min(1),
  transmissionType: z.string().min(1),
  transmissionGears: z.coerce.number().int().positive(),
  drivetrain: z.string().min(1),
  length: z.coerce.number().positive(),
  width: z.coerce.number().positive(),
  height: z.coerce.number().positive(),
  wheelbase: z.coerce.number().positive(),
  weight: z.coerce.number().positive(),
  trunkVolume: z.coerce.number().positive(),
  acceleration: z.coerce.number().positive(),
  topSpeed: z.coerce.number().positive(),
  fuelConsumptionCity: z.coerce.number().positive(),
  fuelConsumptionHighway: z.coerce.number().positive(),
  fuelConsumptionCombined: z.coerce.number().positive(),
});

type CarFormProps = {
  car?: Car;
  onClose: () => void;
};

export const CarForm: React.FC<CarFormProps> = ({ car, onClose }) => {
  const { addCar, updateCar } = useCars();
  const { toast } = useToast();
  const [colors, setColors] = useState<string[]>(car?.colors || ['Белый', 'Черный']);
  const [newColor, setNewColor] = useState('');
  const [features, setFeatures] = useState<CarFeature[]>(car?.features || []);
  const [newFeature, setNewFeature] = useState({ name: '', category: 'Комфорт', isStandard: true });
  const [images, setImages] = useState<CarImage[]>(car?.images || []);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageAlt, setNewImageAlt] = useState('');

  const form = useForm<z.infer<typeof carFormSchema>>({
    resolver: zodResolver(carFormSchema),
    defaultValues: {
      brand: car?.brand || '',
      model: car?.model || '',
      year: car?.year || new Date().getFullYear(),
      bodyType: car?.bodyType || 'Седан',
      price: car?.price.base || 0,
      country: car?.country || 'Россия',
      description: car?.description || '',
      isNew: car?.isNew || false,
      engineType: car?.engine.type || '4-цилиндровый',
      engineDisplacement: car?.engine.displacement || 2.0,
      enginePower: car?.engine.power || 150,
      engineTorque: car?.engine.torque || 200,
      engineFuelType: car?.engine.fuelType || 'Бензин',
      transmissionType: car?.transmission.type || 'Автоматическая',
      transmissionGears: car?.transmission.gears || 6,
      drivetrain: car?.drivetrain || 'Передний',
      length: car?.dimensions.length || 4500,
      width: car?.dimensions.width || 1800,
      height: car?.dimensions.height || 1500,
      wheelbase: car?.dimensions.wheelbase || 2700,
      weight: car?.dimensions.weight || 1500,
      trunkVolume: car?.dimensions.trunkVolume || 450,
      acceleration: car?.performance.acceleration || 9.0,
      topSpeed: car?.performance.topSpeed || 200,
      fuelConsumptionCity: car?.performance.fuelConsumption.city || 8.0,
      fuelConsumptionHighway: car?.performance.fuelConsumption.highway || 6.0,
      fuelConsumptionCombined: car?.performance.fuelConsumption.combined || 7.0,
    },
  });

  const onSubmit = (data: z.infer<typeof carFormSchema>) => {
    if (colors.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Добавьте хотя бы один цвет',
      });
      return;
    }

    if (images.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Добавьте хотя бы одно изображение',
      });
      return;
    }

    const carData: Car = {
      id: car?.id || `car-${uuidv4()}`,
      brand: data.brand,
      model: data.model,
      year: data.year,
      bodyType: data.bodyType,
      colors: colors,
      price: {
        base: data.price,
        withOptions: car?.price.withOptions || data.price,
      },
      engine: {
        type: data.engineType,
        displacement: data.engineDisplacement,
        power: data.enginePower,
        torque: data.engineTorque,
        fuelType: data.engineFuelType,
      },
      transmission: {
        type: data.transmissionType,
        gears: data.transmissionGears,
      },
      drivetrain: data.drivetrain,
      dimensions: {
        length: data.length,
        width: data.width,
        height: data.height,
        wheelbase: data.wheelbase,
        weight: data.weight,
        trunkVolume: data.trunkVolume,
      },
      performance: {
        acceleration: data.acceleration,
        topSpeed: data.topSpeed,
        fuelConsumption: {
          city: data.fuelConsumptionCity,
          highway: data.fuelConsumptionHighway,
          combined: data.fuelConsumptionCombined,
        },
      },
      features: features,
      images: images,
      description: data.description,
      isNew: data.isNew,
      country: data.country,
      viewCount: car?.viewCount || 0,
    };

    if (car) {
      updateCar(carData);
      toast({
        title: 'Автомобиль обновлен',
        description: 'Информация об автомобиле успешно обновлена',
      });
    } else {
      addCar(carData);
      toast({
        title: 'Автомобиль добавлен',
        description: 'Новый автомобиль успешно добавлен в каталог',
      });
    }

    onClose();
  };

  const handleAddColor = () => {
    if (newColor && !colors.includes(newColor)) {
      setColors([...colors, newColor]);
      setNewColor('');
    }
  };

  const handleRemoveColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const handleAddFeature = () => {
    if (newFeature.name) {
      const feature: CarFeature = {
        id: `feature-${uuidv4()}`,
        name: newFeature.name,
        category: newFeature.category,
        isStandard: newFeature.isStandard,
      };
      setFeatures([...features, feature]);
      setNewFeature({ name: '', category: 'Комфорт', isStandard: true });
    }
  };

  const handleRemoveFeature = (id: string) => {
    setFeatures(features.filter((feature) => feature.id !== id));
  };

  const handleAddImage = () => {
    if (newImageUrl) {
      const image: CarImage = {
        id: `image-${uuidv4()}`,
        url: newImageUrl,
        alt: newImageAlt || `${form.getValues('brand')} ${form.getValues('model')}`,
      };
      setImages([...images, image]);
      setNewImageUrl('');
      setNewImageAlt('');
    }
  };

  const handleRemoveImage = (id: string) => {
    setImages(images.filter((image) => image.id !== id));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="main">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="main">Основная информация</TabsTrigger>
            <TabsTrigger value="engine">Двигатель</TabsTrigger>
            <TabsTrigger value="dimensions">Размеры</TabsTrigger>
            <TabsTrigger value="features">Особенности</TabsTrigger>
            <TabsTrigger value="images">Изображения</TabsTrigger>
          </TabsList>

          <TabsContent value="main" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Бренд</FormLabel>
                    <FormControl>
                      <Input placeholder="Toyota" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Модель</FormLabel>
                    <FormControl>
                      <Input placeholder="Camry" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Год выпуска</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bodyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Тип кузова</FormLabel>
                    <FormControl>
                      <Input placeholder="Седан" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Базовая цена (₽)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Страна производства</FormLabel>
                    <FormControl>
                      <Input placeholder="Япония" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="drivetrain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Привод</FormLabel>
                    <FormControl>
                      <Input placeholder="Передний" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isNew"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Новый автомобиль</FormLabel>
                      <FormDescription>
                        Отметьте, если автомобиль новый
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Цвета</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {colors.map((color, index) => (
                  <div key={index} className="flex items-center gap-2 bg-gray-100 p-2 rounded">
                    <span>{color}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveColor(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  placeholder="Новый цвет"
                />
                <Button type="button" onClick={handleAddColor} variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Добавить
                </Button>
              </div>
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Подробное описание автомобиля"
                      {...field}
                      rows={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="engine" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="engineType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Тип двигателя</FormLabel>
                    <FormControl>
                      <Input placeholder="4-цилиндровый" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="engineDisplacement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Объем двигателя (л)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="enginePower"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Мощность (л.с.)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="engineTorque"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Крутящий момент (Нм)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="engineFuelType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Тип топлива</FormLabel>
                    <FormControl>
                      <Input placeholder="Бензин" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="transmissionType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Тип трансмиссии</FormLabel>
                    <FormControl>
                      <Input placeholder="Автоматическая" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="transmissionGears"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Количество передач</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Производительность</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="acceleration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Разгон 0-100 км/ч (сек)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="topSpeed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Максимальная скорость (км/ч)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h4 className="text-md font-medium">Расход топлива (л/100км)</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="fuelConsumptionCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Город</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fuelConsumptionHighway"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Трасса</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fuelConsumptionCombined"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Смешанный</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="dimensions" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="length"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Длина (мм)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="width"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ширина (мм)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Высота (мм)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="wheelbase"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Колесная база (мм)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Вес (кг)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="trunkVolume"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Объем багажника (л)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>

          <TabsContent value="features" className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-4">Особенности и комплектация</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
                    <Input
                      value={newFeature.name}
                      onChange={(e) => setNewFeature({ ...newFeature, name: e.target.value })}
                      placeholder="Климат-контроль"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
                    <Input
                      value={newFeature.category}
                      onChange={(e) => setNewFeature({ ...newFeature, category: e.target.value })}
                      placeholder="Комфорт"
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-7">
                    <Checkbox
                      id="isStandard"
                      checked={newFeature.isStandard}
                      onCheckedChange={(checked) => 
                        setNewFeature({ ...newFeature, isStandard: checked === true })
                      }
                    />
                    <label htmlFor="isStandard" className="text-sm font-medium text-gray-700">
                      В стандартной комплектации
                    </label>
                  </div>
                </div>
                <Button type="button" onClick={handleAddFeature} variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Добавить особенность
                </Button>
              </div>

              <div className="mt-6">
                <h4 className="font-medium mb-2">Добавленные особенности ({features.length})</h4>
                {features.length > 0 ? (
                  <div className="space-y-2">
                    {features.map((feature) => (
                      <Card key={feature.id}>
                        <CardContent className="p-4 flex justify-between items-center">
                          <div>
                            <div className="font-medium">{feature.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {feature.category} • {feature.isStandard ? 'Стандарт' : 'Опция'}
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveFeature(feature.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    Нет добавленных особенностей
                  </p>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="images" className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-4">Изображения автомобиля</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL изображения</label>
                    <Input
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="https://example.com/car-image.jpg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Описание (alt)</label>
                    <Input
                      value={newImageAlt}
                      onChange={(e) => setNewImageAlt(e.target.value)}
                      placeholder="Toyota Camry вид спереди"
                    />
                  </div>
                </div>
                <Button type="button" onClick={handleAddImage} variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Добавить изображение
                </Button>
              </div>

              <div className="mt-6">
                <h4 className="font-medium mb-2">Добавленные изображения ({images.length})</h4>
                {images.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {images.map((image) => (
                      <Card key={image.id}>
                        <CardContent className="p-4">
                          <div className="aspect-video mb-2 overflow-hidden rounded-md">
                            <img
                              src={image.url}
                              alt={image.alt}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.src = '/placeholder.svg';
                              }}
                            />
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="text-sm truncate">{image.alt}</div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveImage(image.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    Нет добавленных изображений
                  </p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button type="submit">
            {car ? 'Сохранить изменения' : 'Добавить автомобиль'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
