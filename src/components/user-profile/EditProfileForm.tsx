/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from "react";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import FileInput from "../form/input/FileInput";
import Select from "../form/Select";
import { updateProfileData } from "@/api/authApis";
import { ProfileEdit } from "@/types/httpResponseType";
import { toast } from "react-toastify";
import { editProfileSchema } from "@/validation/profile";

interface EditProfileFormProps {
    profileData: any;
    onClose: () => void;
    onSave: () => void;
    isSupplier?: boolean;
}

export default function EditProfileForm({ profileData, onClose, onSave, isSupplier = false }: EditProfileFormProps) {
    const [formData, setFormData] = useState({
        name: profileData.name || "",
        gender: profileData.gender || "male",
        email: profileData.email || "",
        phone: profileData.roleDetails.phone || profileData.phoneNumber || "",
        address: profileData.roleDetails.address || "",
        imageUrl: profileData.imageUrl || ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [uploadedImage, setUploadedImage] = useState(profileData.imageUrl || "");
    const [uploading, setUploading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [userId, setUserId] = useState(profileData.id || null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSelectChange = (value: string) => {
        setFormData(prev => ({ ...prev, gender: value }));

        // Clear error when user selects an option
        if (errors.gender) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.gender;
                return newErrors;
            });
        }
    };

    const handleImageUploadStart = () => {
        setUploading(true);
        // Clear error when upload starts
        if (errors.imageUrl) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.imageUrl;
                return newErrors;
            });
        }
    };

    // Update success handler
    const handleImageUploadSuccess = (fileUrl: string) => {
        setUploadedImage(fileUrl);
        setFormData(prev => ({ ...prev, imageUrl: fileUrl }));
        setUploading(false);
        toast.success("Image uploaded successfully!");
    };

    // Update error handler
    const handleImageUploadError = (error: Error) => {
        console.error("Image upload error:", error);
        setUploading(false);
        toast.error("Failed to upload image. Please try again.");
    };

    const validateForm = () => {
        try {
            // Create a validation object based on user role
            const validationData = {
                name: formData.name,
                gender: formData.gender,
                email: formData.email,
                phone: isSupplier ? formData.phone : undefined,
                address: isSupplier ? formData.address : undefined,
                imageUrl: formData.imageUrl
            };

            editProfileSchema.parse(validationData);
            setErrors({});
            return true;
        } catch (error: any) {
            if (error.errors) {
                const newErrors: Record<string, string> = {};
                error.errors.forEach((err: any) => {
                    const field = err.path[0];
                    newErrors[field] = err.message;
                });
                setErrors(newErrors);
            }
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            toast.error("Please fix the validation errors");
            return;
        }

        setIsLoading(true);

        try {
            // Prepare data for API call
            const updateData: ProfileEdit = {
                id: userId
            };

            // Only include fields that have changed
            if (formData.name !== profileData.name) updateData.name = formData.name;
            if (formData.gender !== profileData.gender) updateData.gender = formData.gender;
            if (formData.email !== profileData.email) updateData.email = formData.email;
            if (isSupplier) {
                if (formData.phone !== (profileData.phone || profileData.phoneNumber)) updateData.phone = formData.phone;
                if (formData.address !== profileData.address) updateData.address = formData.address;
            }
            if (formData.imageUrl !== profileData.imageUrl) updateData.imageUrl = formData.imageUrl;

            // If no changes were made
            if (Object.keys(updateData).length === 1) { // Only has id property
                toast.info("No changes were made.");
                onClose();
                return;
            }

            console.log("Update Data:", updateData);
            updateData.id = userId;
            // Call the API
            await updateProfileData(updateData);

            toast.success("Profile updated successfully!");
            onSave(); // Refresh profile data in parent component
            onClose(); // Close the modal
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="no-scrollbar relative w-full overflow-y-auto lg:p-2">
            <div className="px-2 pr-4">
                <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                    Edit Personal Information
                </h4>
                <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                    Update your details to keep your profile up-to-date.
                </p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col">
                <div className="custom-scrollbar max-h-[50vh] overflow-y-auto px-2 pb-3">
                    <div className="mt-4">
                        <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                            Personal Information
                        </h5>

                        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                            <div className="col-span-2 lg:col-span-1">
                                <Label>Name</Label>
                                <Input
                                    type="text"
                                    name="name"
                                    defaultValue={formData.name}
                                    onChange={handleInputChange}
                                    error={!!errors.name}
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="col-span-2 lg:col-span-1">
                                <Label>Gender</Label>
                                <Select
                                    value={formData.gender}
                                    onChange={handleSelectChange}
                                    options={[
                                        { value: "male", label: "Male" },
                                        { value: "female", label: "Female" },
                                        { value: "other", label: "Other" }
                                    ]}
                                />
                                {errors.gender && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.gender}
                                    </p>
                                )}
                            </div>

                            <div className="col-span-2 lg:col-span-1">
                                <Label>Email Address</Label>
                                <Input
                                    type="email"
                                    name="email"
                                    defaultValue={formData.email}
                                    onChange={handleInputChange}
                                    error={!!errors.email}
                                    disabled
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Conditionally render phone number field for suppliers */}
                            {isSupplier && (
                                <div className="col-span-2 lg:col-span-1">
                                    <Label>Phone Number</Label>
                                    <Input
                                        type="tel"
                                        name="phone"
                                        defaultValue={formData.phone}
                                        onChange={handleInputChange}
                                        error={!!errors.phone}
                                        placeholder="Enter phone number"
                                    />
                                    {errors.phone && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.phone}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Conditionally render address field for suppliers */}
                            {isSupplier && (
                                <div className="col-span-2">
                                    <Label>Address</Label>
                                    <Input
                                        type="text"
                                        name="address"
                                        defaultValue={formData.address}
                                        onChange={handleInputChange}
                                        error={!!errors.address}
                                        placeholder="Enter your address"
                                    />
                                    {errors.address && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.address}
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className="col-span-2">
                                <Label>Profile Image</Label>
                                <FileInput
                                    onUploadSuccess={handleImageUploadSuccess}
                                    onUploadError={handleImageUploadError}
                                    onUploadStart={handleImageUploadStart}
                                    accept="image/*"
                                    multiple={false}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={onClose}
                        type="button"
                        disabled={isLoading}
                    >
                        Close
                    </Button>
                    <Button
                        size="sm"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </form>
        </div>
    );
}