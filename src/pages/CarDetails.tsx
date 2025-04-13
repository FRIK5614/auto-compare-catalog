
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCars } from '@/hooks/useCars';
import LoadingState from '@/components/LoadingState';
import { Helmet } from 'react-helmet-async';
import CarDetailsContent from '@/components/car-details/CarDetailsContent';

const CarDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { getCarById, loading, error, viewCar, cars } = useCars();
  const car = getCarById(id || '');

  useEffect(() => {
    if (car) {
      viewCar(car.id);
    }
  }, [car, viewCar]);

  if (!car && id && cars.length > 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto py-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Автомобиль не найден</h2>
          <p className="mb-6 text-gray-600">Возможно, запрашиваемый автомобиль был удален или еще не добавлен.</p>
          <Link to="/cars" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Вернуться к каталогу
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {loading ? (
        <div className="container mx-auto py-8">
          <LoadingState count={3} />
        </div>
      ) : error ? (
        <div className="container mx-auto py-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ошибка загрузки данных</h2>
          <p className="mb-6 text-gray-600">{error}</p>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => window.location.reload()}
          >
            Попробовать снова
          </button>
        </div>
      ) : !car ? (
        <div className="container mx-auto py-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Автомобиль не найден</h2>
          <p className="mb-6 text-gray-600">Запрашиваемый автомобиль не существует или был удален</p>
          <Link to="/cars" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Вернуться к каталогу
          </Link>
        </div>
      ) : (
        <>
          <Helmet>
            <title>{car.brand} {car.model} - Подробная информация</title>
            <meta 
              name="description" 
              content={`Подробная информация об автомобиле ${car.brand} ${car.model}: характеристики, фотографии, описание.`} 
            />
          </Helmet>
          {/* Fix the car prop type issue by rendering inside div */}
          <div>
            <CarDetailsContent car={car} />
          </div>
        </>
      )}
      
      <Footer />
    </div>
  );
};

export default CarDetails;
