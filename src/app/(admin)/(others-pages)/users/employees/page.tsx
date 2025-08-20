import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import EmployeesTable from "@/sections/employees/EmployeesTable";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Next.js Orders Page | MyFOODIE Dashboard",
    description: "This is Next.js Orders Page MyFOODIE Dashboard ",
};


export default function EmployeesPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Employees" />
            <div className="space-y-6">
                <ComponentCard title="Employee Table">
                    <EmployeesTable />
                </ComponentCard>
            </div>

        </div>

    );
}
