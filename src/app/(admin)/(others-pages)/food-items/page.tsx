
import { Metadata } from "next";

import React from "react";
import FoodItempageContent from "@/sections/foodItems/FoodItempageContent";

export const metadata: Metadata = {
    title: "Today Special | MyFOODIE ",
    description: "This is Next.js Food Items Page MyFOODIE Dashboard ",
};

export default function page() {
    return (
        <div>
            <FoodItempageContent />
        </div>
    );
}
