import { useState } from 'react'

import ComponentCard from "@/components/common/ComponentCard";
import EmployeesTable from "@/sections/employees/EmployeesTable";
import Popup from '@/components/ui/popup/Popup';
import EmployeeForm from '@/sections/employees/NewEmployeeForm';


const EmployeepageContent = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const handleAddEmployee = () => {
        setIsPopupOpen(true); // ✅ open popup on button click
    };

    return (
        <>
            <ComponentCard
                title="Employee Table"
                showButton={true}
                handleClick={handleAddEmployee}
            >
                <EmployeesTable />
            </ComponentCard>

            <Popup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                title="Add New Employee"
            >
                <EmployeeForm />
            </Popup>
        </>
    )
}

export default EmployeepageContent
