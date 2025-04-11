
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
import { Loader2, FileDown } from "lucide-react";
import { Car } from "@/types/car";

interface ExportTabProps {
  cars: Car[];
  isExporting: boolean;
  handleExport: () => void;
}

export const ExportTab: React.FC<ExportTabProps> = ({ 
  cars, 
  isExporting, 
  handleExport 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Экспорт данных</CardTitle>
        <CardDescription>
          Экспортируйте все данные автомобилей в формате JSON
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/50 p-4 rounded-md">
          <h3 className="font-semibold mb-2">Информация</h3>
          <p className="text-sm text-muted-foreground mb-2">
            При экспорте будут сохранены все данные о {cars.length} автомобилях в вашей базе данных.
            Файл можно использовать для резервного копирования или передачи данных.
          </p>
          <p className="text-sm text-muted-foreground">
            Экспортированный файл можно будет импортировать обратно через вкладку "Импорт".
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleExport}
          disabled={isExporting || cars.length === 0}
          className="ml-auto"
        >
          {isExporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Экспорт...
            </>
          ) : (
            <>
              <FileDown className="mr-2 h-4 w-4" />
              Экспортировать {cars.length} автомобилей
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
