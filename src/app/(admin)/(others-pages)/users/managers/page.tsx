"use client"
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ManagerpageContent from "@/sections/managers/ManagerpageContent";


export default function ManagersPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Managers" />
            <ManagerpageContent />

        </div>
    );
}
