
import React from "react";
import PurchaseRequestForm from "@/components/PurchaseRequestForm";

interface ConsultSectionProps {
  consultFormRef: React.RefObject<HTMLDivElement>;
}

const ConsultSection = ({ consultFormRef }: ConsultSectionProps) => {
  return (
    <section className="py-16 bg-white" ref={consultFormRef}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12">
            <h2 className="text-3xl font-bold mb-4 text-auto-gray-900">
              Нужна консультация?
            </h2>
            <p className="text-lg text-auto-gray-600 mb-6">
              Заполните форму, и наш менеджер свяжется с вами в ближайшее время, чтобы ответить на все ваши вопросы и помочь с выбором автомобиля.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-auto-blue-100 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-auto-blue-600 font-medium">1</span>
                </div>
                <div>
                  <h4 className="font-medium text-auto-gray-900">Профессиональная консультация</h4>
                  <p className="text-auto-gray-600">Наши эксперты помогут выбрать автомобиль под ваши потребности</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-auto-blue-100 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-auto-blue-600 font-medium">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-auto-gray-900">Индивидуальный подбор</h4>
                  <p className="text-auto-gray-600">Учтем все ваши пожелания и бюджет при выборе автомобиля</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-auto-blue-100 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-auto-blue-600 font-medium">3</span>
                </div>
                <div>
                  <h4 className="font-medium text-auto-gray-900">Быстрый ответ</h4>
                  <p className="text-auto-gray-600">Мы свяжемся с вами в течение 30 минут в рабочее время</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div className="md:w-1/2">
            <PurchaseRequestForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConsultSection;
