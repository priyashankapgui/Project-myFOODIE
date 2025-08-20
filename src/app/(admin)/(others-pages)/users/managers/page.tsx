import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ManagersTable from "@/sections/managers/ManagersTable";
import React from "react";



export default function ManagersPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Managers" />
            <div className="space-y-6">
                <ComponentCard title="Manager   Table">
                    <ManagersTable />
                </ComponentCard>
            </div>

        </div>
    );
}
