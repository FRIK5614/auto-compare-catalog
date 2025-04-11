
import React, { useState, useRef } from "react";
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardFooter, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Loader2, FileUp, Upload, Clipboard } from "lucide-react";

interface ImportTabProps {
  importData: string;
  setImportData: (data: string) => void;
  isImporting: boolean;
  handleImport: () => Promise<void>;
}

export const ImportTab: React.FC<ImportTabProps> = ({ 
  importData, 
  setImportData, 
  isImporting, 
  handleImport 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImportData(content);
    };
    reader.readAsText(file);
  };

  // Copy to clipboard
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(importData);
    toast({
      title: "Скопировано",
      description: "Данные скопированы в буфер обмена",
    });
  };

  // Handle file input click
  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Импорт данных</CardTitle>
        <CardDescription>
          Импортируйте данные автомобилей из JSON файла или вставьте их вручную
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleFileInputClick}
              className="flex items-center"
            >
              <Upload className="mr-2 h-4 w-4" />
              Загрузить файл
            </Button>
            <Input
              type="file"
              accept=".json"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            <Button
              variant="outline"
              onClick={handleCopyToClipboard}
              disabled={!importData}
              className="flex items-center"
            >
              <Clipboard className="mr-2 h-4 w-4" />
              Копировать
            </Button>
          </div>

          <ScrollArea className="h-[400px] border rounded-md p-4">
            <textarea
              className="w-full h-full p-2 font-mono text-sm resize-none focus:outline-none"
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              placeholder='[{"id": "1", "brand": "BMW", "model": "X5", ...}]'
            />
          </ScrollArea>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          {importData && (
            <span className="text-sm text-muted-foreground">
              {importData.length.toLocaleString()} символов
            </span>
          )}
        </div>
        <Button 
          onClick={handleImport}
          disabled={isImporting || !importData}
        >
          {isImporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Импорт...
            </>
          ) : (
            <>
              <FileUp className="mr-2 h-4 w-4" />
              Импортировать
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
