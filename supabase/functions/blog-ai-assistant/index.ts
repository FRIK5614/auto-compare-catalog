
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Configure CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mock AI responses based on automotive questions
function generateAIResponse(question: string): string {
  question = question.toLowerCase();
  
  // Basic automotive question patterns
  if (question.includes('какой расход') || question.includes('экономичный автомобиль')) {
    return 'Самыми экономичными автомобилями считаются гибриды и электромобили. Из бензиновых автомобилей, малолитражки с двигателями 1.0-1.6л обычно имеют расход 5-7 литров на 100 км.';
  }
  
  if (question.includes('лучший внедорожник') || question.includes('какой внедорожник')) {
    return 'Среди лучших внедорожников можно выделить Toyota Land Cruiser и Lexus LX для премиум-сегмента, а также Mitsubishi Pajero Sport и Kia Mohave в среднем ценовом сегменте. Выбор зависит от ваших конкретных требований и бюджета.';
  }
  
  if (question.includes('электромобиль') || question.includes('электрокар')) {
    return 'Электромобили становятся все более популярными. Лидерами рынка являются Tesla Model 3, Nissan Leaf и Volkswagen ID.4. Основные преимущества: экологичность, низкие расходы на обслуживание и топливо. Недостатки: высокая стоимость, ограниченный запас хода и время зарядки.';
  }
  
  if (question.includes('когда менять масло') || question.includes('замена масла')) {
    return 'Обычно моторное масло рекомендуется менять каждые 10,000-15,000 км пробега или раз в год, в зависимости от того, что наступит раньше. Однако точный интервал зависит от марки и модели автомобиля, условий эксплуатации и типа используемого масла. Рекомендуем обратиться к руководству по эксплуатации вашего автомобиля.';
  }
  
  if (question.includes('зимняя резина') || question.includes('когда менять шины')) {
    return 'Зимнюю резину рекомендуется устанавливать, когда среднесуточная температура опускается ниже +7°C. В большинстве регионов России это примерно октябрь-ноябрь. На летнюю резину стоит переходить, когда температура стабильно держится выше +7°C, обычно в апреле-мае.';
  }
  
  // Default response for questions not matching patterns
  return 'В качестве ИИ-ассистента по автомобильной тематике, я могу ответить на ваши вопросы о различных марках и моделях автомобилей, их характеристиках, обслуживании, расходе топлива и других аспектах. Пожалуйста, задайте более конкретный вопрос, и я постараюсь на него ответить.';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question } = await req.json();
    
    if (!question || typeof question !== 'string') {
      return new Response(JSON.stringify({ error: 'Требуется текст вопроса' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }
    
    // Generate a response to the automotive question
    const answer = generateAIResponse(question);
    
    return new Response(JSON.stringify({ answer }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in blog-ai-assistant function:', error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
