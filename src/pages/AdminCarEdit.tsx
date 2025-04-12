
import React from "react";
import AdminLayout from "@/components/AdminLayout";
import ImprovedCarFormContainer from "@/components/admin/car-form/ImprovedCarFormContainer";
import { Toaster } from "@/components/ui/toaster";

const AdminCarEdit = () => {
  return (
    <AdminLayout>
      <ImprovedCarFormContainer />
      <Toaster />
    </AdminLayout>
  );
};

export default AdminCarEdit;
