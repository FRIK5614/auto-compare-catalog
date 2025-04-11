
import React from "react";
import AdminLayout from "@/components/AdminLayout";
import { useCars } from "@/hooks/useCars";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImportTab } from "@/components/admin/import-export/ImportTab";
import { ExportTab } from "@/components/admin/import-export/ExportTab";
import { ImportResultsTab } from "@/components/admin/import-export/ImportResultsTab";
import { useImportExport } from "@/components/admin/import-export/useImportExport";

const AdminImport = () => {
  const { cars, exportCarsData, importCarsData } = useCars();
  
  const {
    importData,
    setImportData,
    isImporting,
    isExporting,
    importResults,
    setImportResults,
    handleImport,
    handleExport
  } = useImportExport(cars, exportCarsData, importCarsData);

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Импорт/Экспорт данных</h1>

        <Tabs defaultValue="import">
          <TabsList className="mb-6">
            <TabsTrigger value="import">Импорт</TabsTrigger>
            <TabsTrigger value="export">Экспорт</TabsTrigger>
            {importResults && <TabsTrigger value="results">Результаты импорта</TabsTrigger>}
          </TabsList>

          <TabsContent value="import">
            <ImportTab 
              importData={importData}
              setImportData={setImportData}
              isImporting={isImporting}
              handleImport={handleImport}
            />
          </TabsContent>

          <TabsContent value="export">
            <ExportTab 
              cars={cars}
              isExporting={isExporting}
              handleExport={handleExport}
            />
          </TabsContent>

          {importResults && (
            <TabsContent value="results">
              <ImportResultsTab 
                results={importResults}
                onClose={() => setImportResults(null)}
              />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminImport;
