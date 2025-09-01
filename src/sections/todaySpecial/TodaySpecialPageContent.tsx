"use client"
import ComponentCard from "@/components/common/ComponentCard";
import TodaySpecialsTable from "@/sections/todaySpecial/TodaySpecialTable";
import { useRouter } from "next/navigation";

const TodaySpecialPageContent = () => {
    const router = useRouter();

    const handleAddOrder = () => {
        router.push('/orders/orderForm');
    };


    return (
        <>
            <ComponentCard
                title="Today Specials Table"
                showButton={true}
                handleClick={handleAddOrder}
            >
                <TodaySpecialsTable />
            </ComponentCard>

        </>
    )
}

export default TodaySpecialPageContent