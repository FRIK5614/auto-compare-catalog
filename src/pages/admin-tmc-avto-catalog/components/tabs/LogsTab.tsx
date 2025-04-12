
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface LogsTabProps {
  logs: string[];
}

export const LogsTab: React.FC<LogsTabProps> = ({ logs }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Логи импорта</CardTitle>
        <CardDescription>
          Информация о процессе импорта и возникших ошибках
        </CardDescription>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Логи пока отсутствуют</p>
          </div>
        ) : (
          <div className="bg-muted/50 p-4 rounded-md overflow-auto max-h-[500px]">
            <pre className="text-xs">
              {logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log.includes('Ошибка') || log.includes('ошибка') ? (
                    <span className="text-destructive">{log}</span>
                  ) : log.includes('Успешно') || log.includes('успешно') ? (
                    <span className="text-green-600 dark:text-green-400">{log}</span>
                  ) : (
                    <span>{log}</span>
                  )}
                </div>
              ))}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
