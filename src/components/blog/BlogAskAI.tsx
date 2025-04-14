
import React, { useState, useRef } from 'react';
import { Send, Bot, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const BlogAskAI: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const answerRef = useRef<HTMLDivElement>(null);

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Пожалуйста, введите ваш вопрос'
      });
      return;
    }

    setLoading(true);
    setError(null);
    setAnswer(null);

    try {
      const { data, error } = await supabase.functions.invoke('blog-ai-assistant', {
        body: { question: question.trim() }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data || !data.answer) {
        throw new Error('Не удалось получить ответ');
      }

      setAnswer(data.answer);
      
      // Scroll to answer
      setTimeout(() => {
        if (answerRef.current) {
          answerRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (err) {
      console.error('Error asking AI:', err);
      setError('Произошла ошибка при получении ответа. Пожалуйста, попробуйте позже.');
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось получить ответ от ИИ-ассистента'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="mb-4 flex items-center">
        <Bot className="h-5 w-5 text-blue-600 mr-2" />
        <h3 className="font-medium">ИИ-ассистент автосалона</h3>
      </div>
      
      <form onSubmit={handleQuestionSubmit}>
        <div className="mb-4">
          <Textarea 
            placeholder="Задайте вопрос об автомобилях, обслуживании, страховке и т.д."
            className="min-h-[100px]"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={loading}
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={loading || !question.trim()}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Получение ответа...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Задать вопрос
            </>
          )}
        </Button>
      </form>
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-md">
          <p>{error}</p>
        </div>
      )}
      
      {answer && (
        <div ref={answerRef} className="mt-6 p-4 bg-blue-50 rounded-md">
          <h4 className="font-medium mb-2 flex items-center">
            <Bot className="h-4 w-4 text-blue-600 mr-2" />
            Ответ:
          </h4>
          <div className="prose prose-sm max-w-none">
            {answer.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
