"use client"
import { useState, useEffect } from 'react'
import ComponentCard from "@/components/common/ComponentCard";
import FoodItemsTable from "@/sections/foodItems/FoodItemTable";
import Popup from '@/components/ui/popup/Popup';
import FoodItemForm from '@/sections/foodItems/NewFoodItem';
import { getLocalUser } from '@/store/local_storage';

const FoodItempageContent = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    type User = { role: string } | null;
    const [user, setUser] = useState<User>(null);

    useEffect(() => {
        // Load user data on component mount
        const localUser = getLocalUser();
        setUser(localUser);
    }, []);

    const handleAddDepartment = () => {
        setIsPopupOpen(true);
    };

    const handleSuccess = () => {
        setIsPopupOpen(false); // Close the popup
        setRefreshKey(prev => prev + 1); // Refresh the table
    };

    // Only show button if user exists and role is NOT 'management'
    const showButton = !!user && user.role !== 'management';

    return (
        <>
            <ComponentCard
                title="Food Items Table"
                showButton={showButton}
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