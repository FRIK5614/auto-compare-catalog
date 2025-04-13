
import React from "react";
import { Car } from "@/types/car";

interface CarSpecificationsTabProps {
  car: Car;
}

const CarSpecificationsTab: React.FC<CarSpecificationsTabProps> = ({ car }) => {
  // Make sure car is available to prevent null reference errors
  if (!car) {
    return <div className="p-4 text-center">Информация об автомобиле недоступна</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3 pb-2 border-b border-auto-gray-200">
          Основные характеристики
        </h3>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
          <div className="flex justify-between py-1 border-b border-auto-gray-100">
            <dt className="text-auto-gray-600">Марка</dt>
            <dd className="font-medium text-auto-gray-900">{car.brand || 'Н/Д'}</dd>
          </div>
          <div className="flex justify-between py-1 border-b border-auto-gray-100">
            <dt className="text-auto-gray-600">Модель</dt>
            <dd className="font-medium text-auto-gray-900">{car.model || 'Н/Д'}</dd>
          </div>
          <div className="flex justify-between py-1 border-b border-auto-gray-100">
            <dt className="text-auto-gray-600">Год выпуска</dt>
            <dd className="font-medium text-auto-gray-900">{car.year || 'Н/Д'}</dd>
          </div>
          <div className="flex justify-between py-1 border-b border-auto-gray-100">
            <dt className="text-auto-gray-600">Тип кузова</dt>
            <dd className="font-medium text-auto-gray-900">{car.bodyType || 'Н/Д'}</dd>
          </div>
        </dl>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 pb-2 border-b border-auto-gray-200">
          Двигатель и трансмиссия
        </h3>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
          <div className="flex justify-between py-1 border-b border-auto-gray-100">
            <dt className="text-auto-gray-600">Тип двигателя</dt>
            <dd className="font-medium text-auto-gray-900">{car.engine?.type || "Н/Д"}</dd>
          </div>
          <div className="flex justify-between py-1 border-b border-auto-gray-100">
            <dt className="text-auto-gray-600">Объем двигателя</dt>
            <dd className="font-medium text-auto-gray-900">{car.engine?.displacement || "Н/Д"} л</dd>
          </div>
          <div className="flex justify-between py-1 border-b border-auto-gray-100">
            <dt className="text-auto-gray-600">Мощность</dt>
            <dd className="font-medium text-auto-gray-900">{car.engine?.power || "Н/Д"} л.с.</dd>
          </div>
          <div className="flex justify-between py-1 border-b border-auto-gray-100">
            <dt className="text-auto-gray-600">Крутящий момент</dt>
            <dd className="font-medium text-auto-gray-900">{car.engine?.torque || "Н/Д"} Нм</dd>
          </div>
          <div className="flex justify-between py-1 border-b border-auto-gray-100">
            <dt className="text-auto-gray-600">Тип топлива</dt>
            <dd className="font-medium text-auto-gray-900">{car.engine?.fuelType || "Н/Д"}</dd>
          </div>
          <div className="flex justify-between py-1 border-b border-auto-gray-100">
            <dt className="text-auto-gray-600">Коробка передач</dt>
            <dd className="font-medium text-auto-gray-900">{car.transmission?.type || "Н/Д"}</dd>
          </div>
          <div className="flex justify-between py-1 border-b border-auto-gray-100">
            <dt className="text-auto-gray-600">Количество передач</dt>
            <dd className="font-medium text-auto-gray-900">
              {car.transmission?.gears || "Вариатор"}
            </dd>
          </div>
          <div className="flex justify-between py-1 border-b border-auto-gray-100">
            <dt className="text-auto-gray-600">Привод</dt>
            <dd className="font-medium text-auto-gray-900">{car.drivetrain || "Н/Д"}</dd>
          </div>
        </dl>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 pb-2 border-b border-auto-gray-200">
          Размеры и масса
        </h3>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
          <div className="flex justify-between py-1 border-b border-auto-gray-100">
            <dt className="text-auto-gray-600">Длина</dt>
            <dd className="font-medium text-auto-gray-900">{car.dimensions?.length || "Н/Д"} мм</dd>
          </div>
          <div className="flex justify-between py-1 border-b border-auto-gray-100">
            <dt className="text-auto-gray-600">Ширина</dt>
            <dd className="font-medium text-auto-gray-900">{car.dimensions?.width || "Н/Д"} мм</dd>
          </div>
          <div className="flex justify-between py-1 border-b border-auto-gray-100">
            <dt className="text-auto-gray-600">Высота</dt>
            <dd className="font-medium text-auto-gray-900">{car.dimensions?.height || "Н/Д"} мм</dd>
          </div>
          <div className="flex justify-between py-1 border-b border-auto-gray-100">
            <dt className="text-auto-gray-600">Колесная база</dt>
            <dd className="font-medium text-auto-gray-900">{car.dimensions?.wheelbase || "Н/Д"} мм</dd>
          </div>
          <div className="flex justify-between py-1 border-b border-auto-gray-100">
            <dt className="text-auto-gray-600">Масса</dt>
            <dd className="font-medium text-auto-gray-900">{car.dimensions?.weight || "Н/Д"} кг</dd>
          </div>
          <div className="flex justify-between py-1 border-b border-auto-gray-100">
            <dt className="text-auto-gray-600">Объем багажника</dt>
            <dd className="font-medium text-auto-gray-900">{car.dimensions?.trunkVolume || "Н/Д"} л</dd>
          </div>
        </dl>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 pb-2 border-b border-auto-gray-200">
          Динамические характеристики
        </h3>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
          <div className="flex justify-between py-1 border-b border-auto-gray-100">
            <dt className="text-auto-gray-600">Разгон до 100 км/ч</dt>
            <dd className="font-medium text-auto-gray-900">{car.performance?.acceleration || "Н/Д"} с</dd>
          </div>
          <div className="flex justify-between py-1 border-b border-auto-gray-100">
            <dt className="text-auto-gray-600">Максимальная скорость</dt>
            <dd className="font-medium text-auto-gray-900">{car.performance?.topSpeed || "Н/Д"} км/ч</dd>
          </div>
          {car.performance?.fuelConsumption && (
            <>
              <div className="flex justify-between py-1 border-b border-auto-gray-100">
                <dt className="text-auto-gray-600">Расход в городе</dt>
                <dd className="font-medium text-auto-gray-900">{car.performance?.fuelConsumption?.city || "Н/Д"} л/100км</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-auto-gray-100">
                <dt className="text-auto-gray-600">Расход на трассе</dt>
                <dd className="font-medium text-auto-gray-900">{car.performance?.fuelConsumption?.highway || "Н/Д"} л/100км</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-auto-gray-100">
                <dt className="text-auto-gray-600">Смешанный цикл</dt>
                <dd className="font-medium text-auto-gray-900">{car.performance?.fuelConsumption?.combined || "Н/Д"} л/100км</dd>
              </div>
            </>
          )}
        </dl>
      </div>
    </div>
  );
};

export default CarSpecificationsTab;
