
import { Button } from '@/components/ui/button';

interface LogsPanelProps {
  showLogs: boolean;
  setShowLogs: (show: boolean) => void;
  logs: string[];
  responseData: string | null;
}

export const LogsPanel = ({
  showLogs,
  setShowLogs,
  logs,
  responseData
}: LogsPanelProps) => {
  if (!showLogs) return null;
  
  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">Логи парсинга:</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowLogs(!showLogs)}
        >
          {showLogs ? 'Скрыть логи' : 'Показать логи'}
        </Button>
      </div>
      {showLogs && (
        <div className="bg-gray-100 p-4 rounded-md max-h-96 overflow-auto">
          <pre className="text-xs whitespace-pre-wrap break-words">
            {logs && logs.length > 0 ? (
              logs.map((log, index) => (
                <div key={index}>{log}</div>
              ))
            ) : responseData ? (
              responseData
            ) : (
              "Нет доступных логов"
            )}
          </pre>
        </div>
      )}
    </div>
  );
};
