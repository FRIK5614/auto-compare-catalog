
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Download, Search, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';
import { Car } from '@/hooks/tmcAvtoCatalog';
import { LogsPanel } from './LogsPanel';

interface ImportPanelProps {
  url: string;
  setUrl: (url: string) => void;
  handleFetch: () => Promise<void>;
  handleImport: () => Promise<void>;
  loading: boolean;
  showLogs: boolean;
  setShowLogs: (show: boolean) => void;
  logs: string[];
  responseData: string | null;
  error: string | null;
  cars: Car[];
  blockedSources: string[];
}

export const ImportPanel = ({
  url,
  setUrl,
  handleFetch,
  handleImport,
  loading,
  showLogs,
  setShowLogs,
  logs,
  responseData,
  error,
  cars,
  blockedSources
}: ImportPanelProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Импорт всех автомобилей</h3>
          <p className="text-muted-foreground mb-4">
            Автоматически импортирует все автомобили из Японии, Кореи и Китая.
          </p>
          <Button 
            onClick={handleImport} 
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Импорт...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Импортировать все автомобили
              </>
            )}
          </Button>
        </div>
        
        <div className="pt-4 border-t">
          <h3 className="text-lg font-medium mb-2">Импорт по URL</h3>
          <p className="text-muted-foreground mb-4">
            Укажите конкретный путь для импорта данных с catalog.tmcavto.ru
          </p>
          <div className="flex gap-2 mb-4">
            <Input 
              value={url} 
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Введите путь, например: /cars/toyota"
              className="flex-1"
              disabled={loading}
            />
            <Button onClick={handleFetch} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Загрузка...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Получить
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <StatusAlerts 
        loading={loading} 
        error={error} 
        cars={cars} 
        blockedSources={blockedSources} 
        handleImport={handleImport} 
      />

      <LogsPanel 
        showLogs={showLogs || logs.length > 0}
        setShowLogs={setShowLogs}
        logs={logs}
        responseData={responseData}
      />
    </div>
  );
};

interface StatusAlertsProps {
  loading: boolean;
  error: string | null;
  cars: Car[];
  blockedSources: string[];
  handleImport: () => Promise<void>;
}

const StatusAlerts = ({ loading, error, cars, blockedSources, handleImport }: StatusAlertsProps) => {
  return (
    <>
      {loading && (
        <Alert className="bg-blue-50 border-blue-200 my-4">
          <Loader2 className="h-4 w-4 text-blue-500 mr-2 animate-spin" />
          <AlertTitle>Импорт в процессе</AlertTitle>
          <AlertDescription>
            Идёт импорт данных. Пожалуйста, подождите. Это может занять некоторое время.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="my-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Ошибка импорта</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <div className="mt-2">
            <Button onClick={handleImport} variant="outline" size="sm">
              Повторить
            </Button>
          </div>
        </Alert>
      )}

      {cars.length > 0 && !loading && !error && (
        <Alert className="bg-green-50 border-green-200 my-4">
          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
          <AlertTitle>Импорт успешно завершен</AlertTitle>
          <AlertDescription>
            Импортировано {cars.length} автомобилей.
          </AlertDescription>
        </Alert>
      )}

      {blockedSources.length > 0 && (
        <Alert className="bg-amber-50 border-amber-200 my-4">
          <ShieldAlert className="h-4 w-4 text-amber-500 mr-2" />
          <AlertTitle>Некоторые источники недоступны</AlertTitle>
          <AlertDescription>
            Сайт блокирует доступ к некоторым данным. Это может быть временно.
            Попробуйте использовать другие источники или повторите попытку позже.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};
