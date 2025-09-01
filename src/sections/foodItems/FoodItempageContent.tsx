"use client"
import { useState } from 'react'
import ComponentCard from "@/components/common/ComponentCard";
import FoodItemsTable from "@/sections/foodItems/FoodItemTable";
import Popup from '@/components/ui/popup/Popup';
import FoodItemForm from '@/sections/foodItems/NewFoodItem';

const FoodItempageContent = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleAddDepartment = () => {
        setIsPopupOpen(true);
    };

    const handleSuccess = () => {
        setIsPopupOpen(false); // Close the popup
        setRefreshKey(prev => prev + 1); // Refresh the table
    };

    return (
        <>
            <ComponentCard
                title="Food Items Table"
                showButton={true}
                handleClick={handleAddDepartment}
            >
                <FoodItemsTable key={refreshKey} />
            </ComponentCard>

            <Popup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                title="Add New Food Item"
            >
                <FoodItemForm onSuccess={handleSuccess} />
            </Popup>
        </>
    )
}

export default FoodItempageContent