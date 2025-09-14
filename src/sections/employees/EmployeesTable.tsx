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
import { getAllNormalEmployees, deleteEmployee } from "@/api/normalEmployeeApis";
import { NormalEmployee, TableEmployee } from "@/types/httpResponseType";
import Popup from "@/components/ui/popup/Popup";
import EmployeeForm from "./EditEmployeeForm";
import DeleteConfirmation from "@/components/common/DeleteConfirmation";
import { toast } from "react-toastify";


const DEFAULT_USER_IMAGE = "/images/user/default-user.jpg";
type PopupMode = "add" | "edit" | "view";

export default function EmployeesTable() {
    const [employees, setEmployees] = useState<TableEmployee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupMode, setPopupMode] = useState<PopupMode>("add");
    const [selectedEmployee, setSelectedEmployee] = useState<TableEmployee | undefined>(undefined);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const apiEmployees: NormalEmployee[] = await getAllNormalEmployees();

            // Transform API data to match table structure
            const transformedEmployees: TableEmployee[] = apiEmployees.map(emp => ({
                id: emp.id,
                user: {
                    image: emp.user.imageUrl,
                    name: emp.user.name,
                    role: emp.position,
                    email: emp.user.email
                },
                department: {
                    name: emp.department.name
                },
                position: emp.position,
            }));

            setEmployees(transformedEmployees);
            setError(null);
        } catch (err) {
            setError("Failed to fetch employees. Please try again.");
            console.error("Error fetching employees:", err);
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(employees.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = employees.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };


    const handleEdit = (id: string) => {
        setPopupMode("edit");
        const employee = employees.find(emp => emp.id === id);
        setSelectedEmployee(employee);
        setIsPopupOpen(true);
    };

    const handleView = (id: string) => {
        setPopupMode("view");
        const employee = employees.find(emp => emp.id === id);
        setSelectedEmployee(employee);
        setIsPopupOpen(true);
    };


    //TODO: Action Delete
    const handleDelete = (id: string) => {
        const employee = employees.find(emp => emp.id === id);
        if (employee) {
            setSelectedEmployee(employee);
            setIsDeleteOpen(true);
        }
    };

    const confirmDelete = async () => {
        if (!selectedEmployee) return;
        try {
            console.log("Deleting employee with ID:", selectedEmployee.id);
            await deleteEmployee(selectedEmployee.id);
            toast.success("Employee deleted successfully!");
            fetchEmployees(); // refresh table
        } catch (err: unknown) {
            toast.error((err as { message?: string })?.message || "Failed to delete employee");
        }
    };

    if (loading) {
        return (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-6">
                <div className="text-center text-gray-500 dark:text-gray-400">
                    Loading employees...
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

    if (employees.length === 0) {
        return (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-6">
                <div className="text-center text-gray-500 dark:text-gray-400">
                    No employees found.
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
                                    Position
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Department
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
                            {currentItems.map((employee) => (
                                <TableRow key={employee.id}>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {employee.id}
                                    </TableCell>

                                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                                        <div className="flex items-center gap-3">

                                            <div className="w-10 h-10 overflow-hidden rounded-full">

                                                <Image
                                                    width={40}
                                                    height={40}
                                                    src={employee.user.image}
                                                    alt={employee.user.name}
                                                    className="object-cover w-10 h-10"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = DEFAULT_USER_IMAGE;
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                    {employee.user.name}
                                                </span>
                                                <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                                    {employee.user.email}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {employee.user.role}
                                    </TableCell>

                                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                        {employee.department.name}
                                    </TableCell>
                                    {/* Actions Column with Button Component */}
                                    <TableCell className="px-4 py-3 text-start">
                                        <div className="flex items-center gap-2">
                                            {/* View Button */}
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleView(employee.id)}
                                                className="p-1 border-transparent text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                            >
                                                <FiEye size={16} />
                                            </Button>
                                            {/* Edit Button */}
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleEdit(employee.id)}
                                            >
                                                <FiEdit size={16} />
                                            </Button>
                                            {/* Delete Button */}
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleDelete(employee.id)}
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
                        ? "Add New Employee"
                        : popupMode === "edit"
                            ? "Edit Employee"
                            : "View Employee"
                }
            >
                <EmployeeForm
                    mode={popupMode}
                    empId={selectedEmployee?.id}
                />
            </Popup>

            <DeleteConfirmation
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={confirmDelete}
                itemName={selectedEmployee?.user.name}
            />



        </div>
    );
}