
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert } from "lucide-react";

interface AlertsPanelProps {
  blockedSources: string[];
}

export const AlertsPanel = ({ blockedSources }: AlertsPanelProps) => {
  if (blockedSources.length === 0) return null;
  
  const sourcesMap: Record<string, string> = {
    'china': 'Китай',
    'japan': 'Япония',
    'korea': 'Корея'
  };
  
  const blockedCountries = blockedSources.map(source => sourcesMap[source] || source).join(', ');
  
  return (
    <Alert className="bg-amber-50 border-amber-200 my-4">
      <ShieldAlert className="h-4 w-4 text-amber-500 mr-2" />
      <AlertTitle>Обнаружены заблокированные источники</AlertTitle>
      <AlertDescription>
        Сайт блокирует парсинг данных из следующих стран: {blockedCountries}. 
        Это может быть временная блокировка или ограничение со стороны сайта.
      </AlertDescription>
    </Alert>
  );
};
