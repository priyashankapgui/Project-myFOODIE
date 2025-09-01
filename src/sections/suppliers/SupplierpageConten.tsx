"use client";
import { useState } from 'react'
import ComponentCard from "@/components/common/ComponentCard";
import SupplierTable from "@/sections/suppliers/SuppliersTable";
import Popup from '@/components/ui/popup/Popup';
import NewSupplierForm from '@/sections/suppliers/NewSupplierForm';

const SupplierpageContent = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0); // Add refresh key state

    const handleAddSupplier = () => {
        setIsPopupOpen(true);
    };

    const handleSuccess = () => {
        setIsPopupOpen(false);
        setRefreshKey(prev => prev + 1); // Refresh the table by changing the key
    };

    return (
        <>
            <ComponentCard
                title="Supplier Table"
                showButton={true}
                handleClick={handleAddSupplier}
            >
                {/* Pass the refresh key to force re-render */}
                <SupplierTable key={refreshKey} />
            </ComponentCard>

            <Popup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                title="Add New Supplier"
            >
                {/* Pass the success callback */}
                <NewSupplierForm onSuccess={handleSuccess} />
            </Popup>
        </>
    )
}

export default SupplierpageContent;