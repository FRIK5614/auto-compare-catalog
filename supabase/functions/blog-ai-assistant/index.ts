
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question } = await req.json();
    
    if (!question || typeof question !== 'string') {
      throw new Error('Question is required');
    }

    // Use car knowledge to answer the question
    // Simple ruleset for demonstrative purposes
    let answer = '';
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('страховк')) {
      answer = 'Мы предлагаем различные варианты страхования для вашего автомобиля. У нас есть ОСАГО, КАСКО и дополнительные программы защиты. Для получения точной информации и расчета стоимости, пожалуйста, свяжитесь с нашими менеджерами или посетите наш автосалон.';
    } else if (lowerQuestion.includes('кредит') || lowerQuestion.includes('рассрочк')) {
      answer = 'В нашем автосалоне вы можете приобрести автомобиль в кредит или рассрочку. Мы сотрудничаем с ведущими банками и предлагаем выгодные условия финансирования. Процентные ставки начинаются от 4.9% годовых, а срок кредита может достигать 7 лет. Для оформления требуется минимальный пакет документов.';
    } else if (lowerQuestion.includes('гарант') || lowerQuestion.includes('сервис')) {
      answer = 'Все автомобили в нашем салоне имеют гарантию производителя. Кроме того, мы предлагаем расширенные программы гарантийного обслуживания. Наш сервисный центр оборудован современной техникой и укомплектован опытными специалистами, которые проведут техническое обслуживание вашего автомобиля на высшем уровне.';
    } else if (lowerQuestion.includes('тест-драйв') || lowerQuestion.includes('тест драйв')) {
      answer = 'Вы можете записаться на тест-драйв любого интересующего вас автомобиля. Для этого достаточно оставить заявку на нашем сайте или позвонить нам. Тест-драйв проводится в сопровождении нашего специалиста, который расскажет вам обо всех особенностях выбранной модели.';
    } else if (lowerQuestion.includes('трейд-ин') || lowerQuestion.includes('трейд ин')) {
      answer = 'Программа Trade-in позволяет вам обменять ваш текущий автомобиль на новый с доплатой. Мы бесплатно оценим ваш автомобиль и предложим выгодные условия обмена. Это удобный способ обновить автомобиль без хлопот по продаже старой машины.';
    } else if (lowerQuestion.includes('доставк') || lowerQuestion.includes('привоз')) {
      answer = 'Мы осуществляем доставку автомобилей по всей России. Сроки и стоимость доставки зависят от региона. Также у нас есть услуга персонального заказа автомобиля с нужной вам комплектацией, если такой модели нет в наличии.';
    } else if (lowerQuestion.includes('комплектаци') || lowerQuestion.includes('опци')) {
      answer = 'В нашем автосалоне представлены различные комплектации автомобилей: от базовых до максимальных. Вы можете выбрать автомобиль с дополнительными опциями, такими как климат-контроль, кожаный салон, панорамная крыша, системы помощи водителю и многое другое.';
    } else {
      // Default response for other questions
      answer = 'Спасибо за ваш вопрос! Для получения более подробной информации по интересующей вас теме, рекомендуем связаться с нашими менеджерами по телефону или посетить наш автосалон. Мы будем рады помочь вам с выбором автомобиля и ответить на все ваши вопросы.';
    }

    // Return the answer
    return new Response(
      JSON.stringify({ 
        answer,
        question
      }),
      {
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        },
        status: 200
      }
    );
  } catch (error) {
    console.error("Error in blog-ai-assistant function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Произошла ошибка при обработке запроса"
      }),
      {
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        },
        status: 400
      }
    );
  }
});
