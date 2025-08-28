"use client"
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import SupplierpageContent from "@/sections/suppliers/SupplierpageConten";

import React from "react";



export default function SuppliersPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Suppliers" />
            <div className="space-y-6">
                <SupplierpageContent />
            </div>
        </div>
    );
}
