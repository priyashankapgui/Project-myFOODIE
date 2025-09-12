/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import React, { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";

import Image from "next/image";
import { getProfileData } from "@/api/authApis";
import Badge from "../ui/badge/Badge";
import EditProfileForm from "./EditProfileForm";
import Popup from "../ui/popup/Popup";

export default function UserInfoCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving changes...");
    closeModal();
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const data = await getProfileData();
        setProfileData(data);
      } catch (err) {
        setError("Failed to load profile data");
        console.error("Error fetching profile data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const getRoleBadge = (role?: string) => {
    switch (role?.toLowerCase()) {
      case "supplier":
        return <Badge color="warning" variant="light">Supplier</Badge>;
      case "management":
        return <Badge color="success" variant="light">Management</Badge>;
      case "normalemployee":
        return <Badge color="info" variant="light">Employee</Badge>;
      default:
        return <Badge color="light" variant="light">Unknown</Badge>;
    }
  };

  const isSupplier = profileData?.role?.toLowerCase() === "supplier";

  if (loading) {
    return (
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex items-center justify-center h-40">
          <p className="text-gray-500">Loading profile data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex items-center justify-center h-40">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex items-center justify-center h-40">
          <p className="text-gray-500">No profile data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-5  xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col space-y-4 items-center w-full gap-6 xl:flex-row">
          <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
            <Image
              width={80}
              height={80}
              src={profileData.imageUrl ?? "/images/user/owner.jpg"}
              alt={`${profileData.name}'s profile picture`}
              className="w-20 h-20 rounded-full object-cover"
            />
          </div>
          <div className="order-3 xl:order-2">
            <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
              {profileData.name.toUpperCase()}
            </h4>
            <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {profileData?.roleDetails?.position?.toUpperCase() || ""}
              </p>
              <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {profileData.email}
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={openModal}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
        >
          <svg
            className="fill-current"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
              fill=""
            />
          </svg>
          Edit
        </button>
      </div>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Personal Information
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-sm leading-normal text-gray-500 dark:text-gray-400">
                Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {profileData.name}
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm leading-normal text-gray-500 dark:text-gray-400">
                Gender
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {profileData.gender?.toUpperCase()}
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm leading-normal text-gray-500 dark:text-gray-400">
                Email address
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {profileData.email}
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm leading-normal text-gray-500 dark:text-gray-400">
                User Id
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {profileData.id}
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm leading-normal text-gray-500 dark:text-gray-400">
                Role Id
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {profileData.roleDetails.id}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm leading-normal text-gray-500 dark:text-gray-400">
                Role
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {getRoleBadge(profileData?.role)}
              </p>
            </div>

            {/* Conditionally render phone number for suppliers */}
            {isSupplier && (
              <div>
                <p className="mb-2 text-sm leading-normal text-gray-500 dark:text-gray-400">
                  Phone Number
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {profileData.roleDetails.phone || "Not provided"}
                </p>
              </div>
            )}

            {/* Conditionally render address for suppliers */}
            {isSupplier && (
              <div>
                <p className="mb-2 text-sm leading-normal text-gray-500 dark:text-gray-400">
                  Address
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {profileData.roleDetails.address || "Not provided"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Popup
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-6xl w-full mx-4"
        contentClassName=" max-h-[73vh] "
        overlayClassName="max-h-[73vh] mt-20 z-100000 "
      >
        <EditProfileForm
          profileData={profileData}
          onClose={closeModal}
          onSave={handleSave}
          isSupplier={isSupplier}
        />
      </Popup>
    </div>
  );
}