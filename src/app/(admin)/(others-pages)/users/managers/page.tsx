"use client"
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ManagerpageContent from "@/sections/managers/ManagerpageContent";
import React from "react";



export default function ManagersPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Managers" />
            <ManagerpageContent />

        </div>
    );
}
