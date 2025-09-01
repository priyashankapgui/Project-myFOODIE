import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import LottieAnimation from "@/components/common/LottieAnimation";


export const metadata: Metadata = {
  title:
    "My Foodie Dashboard",
  description: "This is My Foodie Dashboard",
};


export default function Ecommerce() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics />

        <MonthlySalesChart />

      </div>

      <div className="col-span-12 xl:col-span-5">
        <LottieAnimation />
      </div>


    </div>
  );
}
