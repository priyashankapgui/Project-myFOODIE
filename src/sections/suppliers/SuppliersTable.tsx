"use client";
import React, { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import Image from "next/image";
import Pagination from "@/components/tables/Pagination";
import Button from "@/components/ui/button/Button";
import { FiTrash, FiEye, FiEdit } from "react-icons/fi";
import { getAllSuppliers, deleteSupplier } from "@/api/supplierApis";
import { SupplierResponse, TableSupplier } from "@/types/httpResponseType";
import Popup from "@/components/ui/popup/Popup";
import EditSupplierForm from "@/sections/suppliers/EditSupplierForm";
import DeleteConfirmation from "@/components/common/DeleteConfirmation";
import { toast } from "react-toastify";



const DEFAULT_USER_IMAGE = "/images/user/default-user.jpg";
type PopupMode = "add" | "edit" | "view";
export default function SupplierTable() {
    const [suppliers, setSuppliers] = useState<TableSupplier[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupMode, setPopupMode] = useState<PopupMode>("add");
    const [selectedSupplier, setSelectedSupplier] = useState<TableSupplier | undefined>(undefined);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    useEffect(() => {
        getAllUserSuppliers();
    }, []);

    const getAllUserSuppliers = async () => {
        try {
            setLoading(true);
            const apiSuppliers: SupplierResponse[] = await getAllSuppliers() ?? [];

            // Transform API data to match table structure
            const transformedSupplier: TableSupplier[] = apiSuppliers.map(sup => ({
                id: sup.id,
                foodType: sup.foodType,
                phone: sup.phone,
                user: {
                    image: DEFAULT_USER_IMAGE,
                    name: sup.user.name,
                    email: sup.user.email,
                },


            }));

            setSuppliers(transformedSupplier);
            setError(null);
        } catch (err) {
            setError("Failed to fetch supplier. Please try again.");
            console.error("Error fetching suppliers:", err);
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(suppliers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = suppliers.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Handle Edit
    const handleEdit = (id: string) => {
        setPopupMode("edit");
        const supplier = suppliers.find(sup => sup.id === id);
        setSelectedSupplier(supplier);
        setIsPopupOpen(true);
    };

    // Handle View
    const handleView = (id: string) => {
        setPopupMode("view");
        const supplier = suppliers.find(sup => sup.id === id);
        setSelectedSupplier(supplier);
        setIsPopupOpen(true);
    };


    // Handle Delete
    const handleDelete = (id: string) => {
        const supplier = suppliers.find(sup => sup.id === id);
        if (supplier) {
            setSelectedSupplier(supplier);
            setIsDeleteOpen(true);
        }
    };

    const confirmDelete = async () => {
        if (!selectedSupplier) return;
        try {
            console.log("Deleting supplier with ID:", selectedSupplier.id);
            await deleteSupplier(selectedSupplier.id);
            toast.success("Supplier deleted successfully!");
            getAllUserSuppliers();
        } catch (err: unknown) {
            toast.error((err as { message?: string })?.message || "Failed to delete supplier");
        }
    };

    if (loading) {
        return (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-6">
                <div className="text-center text-gray-500 dark:text-gray-400">
                    Loading suppliers...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-6">
                <div className="text-center text-red-500 dark:text-red-400">
                    {error}
                </div>
            </div>
        );
    }

    if (suppliers.length === 0) {
        return (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-6">
                <div className="text-center text-gray-500 dark:text-gray-400">
                    No suppliers found.
                </div>
            </div>
        );
    }
    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">

            <div className="max-w-full overflow-x-auto">

                <div className="min-w-[1102px]">

                    <Table>
                        {/* Table Header */}
                        <TableHeader className="border-b border-gray-100  dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    ID
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    User
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Food Type
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Mobile
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHeader>

                        {/* Table Body */}
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {currentItems.map((supplier) => (
                                <TableRow key={supplier.id}>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {supplier.id}
                                    </TableCell>

                                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                                        <div className="flex items-center gap-3">

                                            <div className="w-10 h-10 overflow-hidden rounded-full">

                                                <Image
                                                    width={40}
                                                    height={40}
                                                    src={supplier.user.image || DEFAULT_USER_IMAGE}
                                                    alt={supplier.user.name}
                                                    className="object-cover"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = DEFAULT_USER_IMAGE;
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                    {supplier.user.name}
                                                </span>
                                                <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                                    {supplier.user.email}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {supplier.foodType}
                                    </TableCell>

                                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                        {supplier.phone}
                                    </TableCell>
                                    {/* Actions Column with Button Component */}
                                    <TableCell className="px-4 py-3 text-start">
                                        <div className="flex items-center gap-2">
                                            {/* View Button */}
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleView(supplier.id)}
                                                className="p-1 border-transparent text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                            >
                                                <FiEye size={16} />
                                            </Button>
                                            {/* Edit Button */}
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleEdit(supplier.id)}
                                            >
                                                <FiEdit size={16} />
                                            </Button>
                                            {/* Delete Button */}
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleDelete(supplier.id)}
                                                className="text-red-600 hover:text-red-700 hover:border-red-200 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                                            >
                                                <FiTrash size={16} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Pagination Component */}
                    <div className="px-6 py-4 border-t border-gray-100 dark:border-white/[0.05]">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />

                    </div>
                </div>
            </div>
            <Popup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                title={
                    popupMode === "add"
                        ? "Add New Supplier"
                        : popupMode === "edit"
                            ? "Edit Supplier"
                            : "View Supplier"
                }
            >
                <EditSupplierForm
                    mode={popupMode}
                    supId={selectedSupplier?.id}
                />
            </Popup>

            <DeleteConfirmation
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={confirmDelete}
                itemName={selectedSupplier?.user.name}
            />
        </div>
    )
}
