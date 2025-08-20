import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import SuppliersTable from "@/sections/suppliers/SuppliersTable";
import React from "react";



export default function SuppliersPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Suppliers" />
            <div className="space-y-6">
                <ComponentCard title="Supplier Table">
                    <SuppliersTable />
                </ComponentCard>
            </div>
        </div>
    );
}
