"use client"
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import SupplierpageContent from "@/sections/suppliers/SupplierpageConten";

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
