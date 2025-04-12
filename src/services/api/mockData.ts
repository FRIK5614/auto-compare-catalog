
import { Car } from '@/types/car';

/**
 * Генерация мок-данных о автомобилях для Китая
 * Это служебная функция для создания тестовых данных, когда реальные данные недоступны
 */
export const generateMockCarsForChina = (count: number = 10): Car[] => {
  const chineseBrands = ['Geely', 'BYD', 'Great Wall', 'Chery', 'Haval', 'JAC', 'Lifan', 'Dongfeng', 'Foton', 'Changan'];
  const models = ['Atlas', 'Coolray', 'Tugella', 'Tang', 'Han', 'Hovel H6', 'Jolion', 'Tiggo 7 Pro', 'Tiggo 8', 'Arrizo 5'];
  const years = [2020, 2021, 2022, 2023, 2024];
  const bodyTypes = ['SUV', 'Седан', 'Кроссовер', 'Хэтчбек'];
  
  const mockCars: Car[] = [];
  
  for (let i = 0; i < count; i++) {
    const brand = chineseBrands[Math.floor(Math.random() * chineseBrands.length)];
    const model = models[Math.floor(Math.random() * models.length)];
    const year = years[Math.floor(Math.random() * years.length)];
    const basePrice = Math.floor(Math.random() * 2000000) + 800000;
    const bodyType = bodyTypes[Math.floor(Math.random() * bodyTypes.length)];
    
    // Create a simple mock car object
    mockCars.push({
      id: `china-${brand}-${model}-${i}`,
      brand,
      model,
      year,
      bodyType,
      colors: ['Белый', 'Черный', 'Серебристый'],
      price: {
        base: basePrice,
        discount: Math.random() > 0.7 ? Math.floor(basePrice * 0.1) : undefined
      },
      engine: {
        type: '4-цилиндровый',
        displacement: 1.5 + Math.floor(Math.random() * 10) / 10,
        power: 120 + Math.floor(Math.random() * 100),
        torque: 200 + Math.floor(Math.random() * 150),
        fuelType: Math.random() > 0.3 ? 'Бензин' : 'Дизель'
      },
      transmission: {
        type: Math.random() > 0.5 ? 'Автоматическая' : 'Механическая',
        gears: 5 + Math.floor(Math.random() * 3)
      },
      drivetrain: Math.random() > 0.6 ? 'Передний' : 'Полный',
      dimensions: {
        length: 4500 + Math.floor(Math.random() * 500),
        width: 1800 + Math.floor(Math.random() * 200),
        height: 1600 + Math.floor(Math.random() * 200),
        wheelbase: 2600 + Math.floor(Math.random() * 200),
        weight: 1500 + Math.floor(Math.random() * 500),
        trunkVolume: 400 + Math.floor(Math.random() * 200)
      },
      performance: {
        acceleration: 8 + Math.random() * 4,
        topSpeed: 180 + Math.floor(Math.random() * 50),
        fuelConsumption: {
          city: 8 + Math.random() * 3,
          highway: 6 + Math.random() * 2,
          combined: 7 + Math.random() * 2
        }
      },
      features: [
        {
          id: `feature-${i}-1`,
          name: 'Климат-контроль',
          category: 'Комфорт',
          isStandard: true
        },
        {
          id: `feature-${i}-2`,
          name: 'Парктроник',
          category: 'Безопасность',
          isStandard: Math.random() > 0.5
        }
      ],
      images: [
        {
          id: `image-${i}-1`,
          url: '/placeholder.svg',
          alt: `${brand} ${model}`
        }
      ],
      description: `${brand} ${model} - современный китайский автомобиль ${bodyType.toLowerCase()} с экономичным расходом топлива и богатой комплектацией.`,
      isNew: Math.random() > 0.7,
      country: 'Китай',
      viewCount: Math.floor(Math.random() * 100)
    });
  }
  
  return mockCars;
};
