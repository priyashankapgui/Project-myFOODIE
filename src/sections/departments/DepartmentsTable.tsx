"use client";
import React, { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Pagination from "@/components/tables/Pagination";
import Button from "@/components/ui/button/Button";
import { FiTrash, FiEye, FiEdit, } from "react-icons/fi";
import { getDepartments, deleteDepartment } from "@/api/departmentApis";
import { Department } from "@/types/httpResponseType";
import Popup from "@/components/ui/popup/Popup";
import DepartmentForm from "./EditDepartmentForm";
import DeleteConfirmation from "@/components/common/DeleteConfirmation";
import { toast } from "react-toastify";

type PopupMode = "add" | "edit" | "view";

export default function DepartmentsTable() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupMode, setPopupMode] = useState<PopupMode>("add");
    const [selectedDepartment, setSelectedDepartment] = useState<Department | undefined>(undefined);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            setLoading(true);
            const apiDepartments: Department[] = await getDepartments();
            setDepartments(apiDepartments);
            setError(null);
        } catch (err) {
            setError("Failed to fetch departments. Please try again.");
            console.error("Error fetching departments:", err);
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(departments.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = departments.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };


    const handleEdit = (id: number) => {
        setPopupMode("edit");
        const department = departments.find(dept => dept.id === id);
        setSelectedDepartment(department);
        setIsPopupOpen(true);
    };

    const handleView = (id: number) => {
        setPopupMode("view");
        const department = departments.find(dept => dept.id === id);
        setSelectedDepartment(department);
        setIsPopupOpen(true);
    };

    const handleDelete = (id: number) => {
        const department = departments.find(dept => dept.id === id);
        if (department) {
            setSelectedDepartment(department);
            setIsDeleteOpen(true);
        }
    };

    const confirmDelete = async () => {
        if (!selectedDepartment) return;
        try {
            console.log("Deleting department with ID:", selectedDepartment.id);
            await deleteDepartment(selectedDepartment.id);
            toast.success("Department deleted successfully!");
            fetchDepartments(); // refresh table
        } catch (err: unknown) {
            toast.error((err as { message?: string })?.message || "Failed to delete department");
        }
    };

    if (loading) {
        return (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-6">
                <div className="text-center text-gray-500 dark:text-gray-400">
                    Loading departments...
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
                                    Department Name
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Total Employees
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
                            {currentItems.map((department) => (
                                <TableRow key={department.id}>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {department.id}
                                    </TableCell>

                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                            {department.name}
                                        </span>
                                    </TableCell>

                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {department.totalemp}
                                    </TableCell>

                                    {/* Actions Column with Button Component */}
                                    <TableCell className="px-4 py-3 text-start">
                                        <div className="flex items-center gap-2">
                                            {/* View Button */}
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleView(department.id)}
                                                className="p-1 border-transparent text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                            >
                                                <FiEye size={16} />
                                            </Button>
                                            {/* Edit Button */}
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleEdit(department.id)}
                                            >
                                                <FiEdit size={16} />
                                            </Button>
                                            {/* Delete Button */}
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleDelete(department.id)}
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
                        ? "Add New Department"
                        : popupMode === "edit"
                            ? "Edit Department"
                            : "View Department"
                }
            >
                <DepartmentForm
                    mode={popupMode}
                    departmentId={selectedDepartment?.id}
                    onSubmit={async () => {
                        setIsPopupOpen(false);
                        await fetchDepartments();
                    }}
                />
            </Popup>

            <DeleteConfirmation
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={confirmDelete}
                itemName={selectedDepartment?.name}
            />
        </div>
    );
}