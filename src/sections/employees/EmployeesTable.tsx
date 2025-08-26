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
import { getAllNormalEmployees } from "@/api/normalEmployeeApis";
import { NormalEmployee } from "@/types/httpResponseType";


interface TableEmployee {
    id: string;
    user: {
        image: string;
        name: string;
        role: string;
        email: string;
    };
    department: {
        name: string;
    };
    status: string;
    budget: string;
    position: string;
    departmentId: number;
}

// Default user image (you can add this to your public/images folder)
const DEFAULT_USER_IMAGE = "/images/user/default-user.jpg";

// Default team images for demonstration
const DEFAULT_TEAM_IMAGES = [
    "/images/user/user-22.jpg",
    "/images/user/user-23.jpg",
    "/images/user/user-24.jpg",
];

// Helper function to generate random status
const getRandomStatus = () => {
    const statuses = ["Active", "Pending", "Cancel"];
    return statuses[Math.floor(Math.random() * statuses.length)];
};

// Helper function to generate random budget
const getRandomBudget = () => {
    const budgets = ["2.5K", "3.9K", "4.5K", "12.7K", "24.9K"];
    return budgets[Math.floor(Math.random() * budgets.length)];
};

export default function EmployeesTable() {
    const [employees, setEmployees] = useState<TableEmployee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

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
                    image: DEFAULT_USER_IMAGE,
                    name: emp.user.name,
                    role: emp.position,
                    email: emp.user.email
                },
                projectName: `Project ${emp.departmentId}`,
                team: {
                    images: DEFAULT_TEAM_IMAGES
                },
                department: {
                    name: emp.department.name
                },
                status: getRandomStatus(),
                budget: getRandomBudget(),
                position: emp.position,
                departmentId: emp.departmentId
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

    // Action handlers
    const handleView = (id: string) => {
        console.log("View employee with ID:", id);

    };

    const handleEdit = (id: string) => {
        console.log("Edit employee with ID:", id);

    };

    const handleDelete = (id: string) => {
        console.log("Delete employee with ID:", id);
        // Add your delete logic here
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
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
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
                                                    src={employee.user.image || DEFAULT_USER_IMAGE}
                                                    alt={employee.user.name}
                                                    className="object-cover"
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
        </div>
    );
}