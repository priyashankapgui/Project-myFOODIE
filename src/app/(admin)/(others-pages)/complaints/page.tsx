import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComplaintForm from "@/sections/complaints/complaintsForm";
import React from "react";

export default function page() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Complaints" />
            <div className="flex justify-center">
                <div className="w-2/3">
                    <ComplaintForm />
                </div>
            </div>
        </div>
    );
}
