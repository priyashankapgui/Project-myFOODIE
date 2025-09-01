"use client"
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

import AddNewOrderForm from "@/sections/todaySpecial/NewOrderForm";
import React from "react";

export default function page() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Complaints" />
            <div className="flex justify-center">
                <div className="w-2/3">
                    <AddNewOrderForm />

                </div>
            </div>
        </div>
    );
}
