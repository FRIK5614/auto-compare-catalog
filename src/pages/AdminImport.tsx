
import React, { useState } from "react";
import { useCars } from "@/hooks/useCars";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImportTab } from "@/components/admin/import-export/ImportTab";
import { ExportTab } from "@/components/admin/import-export/ExportTab";
import { ImportResultsTab } from "@/components/admin/import-export/ImportResultsTab";
import { useExportImport } from "@/hooks/useExportImport";

const AdminImport = () => {
  const { cars } = useCars();
  const [activeTab, setActiveTab] = useState("import");
  
  const {
    importData,
    setImportData,
    isImporting,
    isExporting,
    importResults,
    handleImport,
    handleExport,
    exportCarsData
  } = useExportImport();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Импорт/Экспорт данных</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="import">Импорт</TabsTrigger>
          <TabsTrigger value="export">Экспорт</TabsTrigger>
          {importResults && importResults.errors.length > 0 && 
            <TabsTrigger value="results">Результаты импорта</TabsTrigger>
          }
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

        <TabsContent value="results">
          <ImportResultsTab 
            results={importResults}
            onClose={() => setActiveTab("import")}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminImport;
