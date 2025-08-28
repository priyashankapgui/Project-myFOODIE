"use client";
import { useState } from 'react'
import ComponentCard from "@/components/common/ComponentCard";
import ManagerTable from "@/sections/managers/ManagersTable";
import Popup from '@/components/ui/popup/Popup';
import NewManagerForm from '@/sections/managers/NewMangerForm';

const ManagerpageContent = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);


    const handleAddManager = () => {
        setIsPopupOpen(true);
    };



    return (
        <>
            <ComponentCard
                title="Supplier Table"
                showButton={true}
                handleClick={handleAddManager}
            >
                {/* Pass the refresh key to force re-render */}
                <ManagerTable />
            </ComponentCard>

            <Popup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                title="Add New Manager"
            >
                {/* Pass the success callback */}
                <NewManagerForm />
            </Popup>
        </>
    )
}

export default ManagerpageContent;