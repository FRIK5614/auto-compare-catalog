
import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import { TmcAvtoCatalogTabs } from './components/TmcAvtoCatalogTabs';

const AdminTmcAvtoCatalog = () => {
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Каталог TMC Авто</h1>
        <TmcAvtoCatalogTabs />
      </div>
    </AdminLayout>
  );
};

export default AdminTmcAvtoCatalog;
