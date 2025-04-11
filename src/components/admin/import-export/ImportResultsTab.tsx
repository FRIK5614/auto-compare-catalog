
import React from "react";
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardFooter, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check } from "lucide-react";

interface ImportResultsProps {
  results: {
    total: number;
    successful: number;
    failed: number;
    errors: string[];
  };
  onClose: () => void;
}

export const ImportResultsTab: React.FC<ImportResultsProps> = ({ results, onClose }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Результаты импорта</CardTitle>
        <CardDescription>
          Информация о результатах последнего импорта
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="default">{results.total}</Badge>
              <span>Всего автомобилей</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400">
                <Check className="mr-1 h-3 w-3" />
                {results.successful}
              </Badge>
              <span>Успешно импортировано</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="destructive">{results.failed}</Badge>
              <span>Не удалось импортировать</span>
            </div>
          </div>
        </div>

        {results.errors.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Ошибки:</h3>
            <ScrollArea className="h-[200px] border rounded-md p-2">
              <ul className="space-y-1">
                {results.errors.map((error, index) => (
                  <li key={index} className="text-sm text-destructive">
                    {error}
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant="default" 
          onClick={onClose}
          className="ml-auto"
        >
          Закрыть
        </Button>
      </CardFooter>
    </Card>
  );
};
