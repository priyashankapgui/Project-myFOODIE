
import { Metadata } from "next";

import React from "react";
import DepartmentspageContent from "@/sections/departments/DepartmentspageContent";

export const metadata: Metadata = {
    title: "Departments | MyFOODIE ",
    description: "This is Next.js Departments Page MyFOODIE  ",
};

export default function page() {
    return (
        <div>
            <DepartmentspageContent />
        </div>
    );
}
