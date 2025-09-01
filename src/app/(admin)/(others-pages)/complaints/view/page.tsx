"use client"
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import React from "react";
import FeedbacksTable from "@/sections/complaints/complaintsTable";


export default function page() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Complaints View" />
            <div className="flex justify-center">
                <ComponentCard
                    title="Complaints Table"
                    showButton={false}
                >
                    <FeedbacksTable />
                </ComponentCard>
            </div>
        </div>
    );
}
