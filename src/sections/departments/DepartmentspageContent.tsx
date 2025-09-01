"use client"
import { useState } from 'react'
import ComponentCard from "@/components/common/ComponentCard";
import DepartmentsTable from "@/sections/departments/DepartmentsTable";
import Popup from '@/components/ui/popup/Popup';
import NewDepartmentForm from '@/sections/departments/NewDepartmentForm';

const DepartmentspageContent = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleAddDepartment = () => {
        setIsPopupOpen(true);
    };

    const handleSuccess = () => {
        setIsPopupOpen(false); // Close the popup
        setRefreshKey(prev => prev + 1);
    };

    return (
        <>
            <ComponentCard
                title="Department Table"
                showButton={true}
                handleClick={handleAddDepartment}
            >
                <DepartmentsTable key={refreshKey} /> {/* Add key to force re-render */}
            </ComponentCard>

            <Popup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                title="Add New Department"
            >
                <NewDepartmentForm onSuccess={handleSuccess} />
            </Popup>
        </>
    )
}

export default DepartmentspageContent