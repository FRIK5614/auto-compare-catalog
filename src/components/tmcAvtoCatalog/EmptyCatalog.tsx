
import { Button } from '@/components/ui/button';
import { Loader2, Download } from 'lucide-react';

interface EmptyCatalogProps {
  loading: boolean;
  handleImport: () => Promise<void>;
  showImportTab: boolean;
}

export const EmptyCatalog = ({ loading, handleImport, showImportTab }: EmptyCatalogProps) => {
  return (
    <div className="text-center py-8">
      <p className="text-muted-foreground mb-4">В каталоге пока нет данных</p>
      {showImportTab && (
        <Button onClick={handleImport} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Загрузка...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Импортировать данные
            </>
          )}
        </Button>
      )}
    </div>
  );
};
