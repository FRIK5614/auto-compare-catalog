
import React from "react";
import AdminLayout from "@/components/AdminLayout";
import CarFormContainer from "@/components/admin/car-form/CarFormContainer";
import { Toaster } from "@/components/ui/toaster";

const AdminCarEdit = () => {
  return (
    <AdminLayout>
      <CarFormContainer />
      <Toaster />
    </AdminLayout>
  );
};

export default AdminCarEdit;
