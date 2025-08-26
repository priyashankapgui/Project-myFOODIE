// app/employees/EmployeesClient.tsx
"use client";

import ComponentCard from "@/components/common/ComponentCard";
import EmployeesTable from "@/sections/employees/EmployeesTable";


export default function EmployeesClient() {

    const handleAddEmployee = () => {
        console.log("Add new employee clicked");
        // You can navigate to a form page or open a modal
        // router.push("/employees/new");
    };

    return (
        <div className="space-y-6">
            <ComponentCard
                title="Employee Table"
                showButton={true}
                handleClick={handleAddEmployee}


            >
                <EmployeesTable />
            </ComponentCard>
        </div>
    );
}