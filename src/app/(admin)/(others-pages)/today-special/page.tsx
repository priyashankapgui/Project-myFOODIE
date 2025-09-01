import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TodaySpecialPageContent from "@/sections/todaySpecial/TodaySpecialPageContent";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Today Special | MyFOODIE ",
    description: "This is Next.js Today Special Page MyFOODIE Dashboard ",
};

export default function TodaySpecialPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Today Special" />

            <TodaySpecialPageContent />

        </div>
    );
}
