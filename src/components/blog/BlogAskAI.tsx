
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const BlogAskAI: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAskQuestion = async () => {
    if (!question.trim()) return;
    
    setLoading(true);
    setAnswer('');
    
    try {
      // Call our Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('blog-ai-assistant', {
        body: { question }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data && data.answer) {
        setAnswer(data.answer);
      } else {
        throw new Error('Не удалось получить ответ от ассистента');
      }
    } catch (err) {
      console.error('Error asking AI assistant:', err);
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
    <div className="space-y-4">
      <Textarea 
        placeholder="Задайте вопрос по автомобильной тематике..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="min-h-[100px] resize-none"
      />
      
      <div className="flex justify-end">
        <Button 
          onClick={handleAskQuestion} 
          disabled={loading || !question.trim()}
          className="flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Обработка...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Спросить
            </>
          )}
        </Button>
      </div>
      
      {answer && (
        <div className="bg-gray-100 p-4 rounded-md mt-4">
          <h3 className="text-lg font-medium mb-2">Ответ ИИ-ассистента:</h3>
          <div className="prose prose-sm max-w-none">
            <p>{answer}</p>
          </div>
        </div>
      )}
    </div>
  );
};
