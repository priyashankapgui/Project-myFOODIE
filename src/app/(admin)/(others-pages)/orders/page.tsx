import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import OrderTable from "@/sections/orders/OrdersTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Next.js Orders Page | MyFOODIE Dashboard",
    description: "This is Next.js Orders Page MyFOODIE Dashboard ",
};

export default function OrdersPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Orders" />
            <OrderTable />
        </div>
    );
}
