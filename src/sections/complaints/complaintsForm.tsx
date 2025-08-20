/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import TextArea from "@/components/form/input/TextArea";
import Select from "@/components/form/Select";
import { IoIosArrowDown } from "react-icons/io";
import DatePicker from '@/components/form/date-picker';

export default function ComplaintForm() {
    const [name, setName] = useState("");
    const [foodtype, setFoodtype] = useState("");
    const [complaint, setComplaint] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState({
        name: false,
        foodtype: false,
        complaint: false,
    });
    const options = [
        { value: "Breakfast", label: "Breakfast" },
        { value: "Lunch", label: "Lunch" },
        { value: "Dinner", label: "Dinner" },
    ];

    const validate = () => {
        const nameValid = name.trim().length > 0;
        const foodtypeValid = foodtype.trim().length > 0;
        const complaintValid = complaint.trim().length > 10;

        setError({
            name: !nameValid,
            foodtype: !foodtypeValid,
            complaint: !complaintValid,
        });

        return nameValid && foodtypeValid && complaintValid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            setSubmitted(true);
            console.log({ name, foodtype, complaint });
            // Reset if needed
            // setName("");
            // setFoodtype("");
            // setComplaint("");
        }
    };

    function handleSelectChange(value: string): void {
        setFoodtype(value);
        setError((prev) => ({ ...prev, foodtype: false }));
    }

    return (
        <ComponentCard
            title="Complaint Form"
            desc="Submit your complaints."
        >
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                {/* Name Field */}
                <div>
                    <Label>Select Supplier</Label>
                    <div className="relative">
                        <Select
                            options={options}
                            placeholder="Select a supplier"
                            onChange={handleSelectChange}
                            className="dark:bg-dark-900"
                        />
                        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-500">
                            <IoIosArrowDown />
                        </span>
                    </div>
                </div>

                {/* Foodtype Field */}
                <div>
                    <Label>Select Input</Label>
                    <div className="relative">
                        <Select
                            options={options}
                            placeholder="Select a food type"
                            onChange={handleSelectChange}
                            className="dark:bg-dark-900"
                        />
                        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-500">
                            <IoIosArrowDown />
                        </span>
                    </div>
                </div>

                <div>
                    <DatePicker
                        id="complaint-date-picker"
                        label="Complaint Date (only today or past dates)"
                        placeholder="Select the complaint date"
                        onChange={(dates, currentDateString) => {
                            console.log({ dates, currentDateString });
                        }}
                    />
                </div>

                {/* Complaint Field */}
                <div>
                    <Label>Complaint</Label>
                    <TextArea
                        value={message}
                        onChange={(value) => setMessage(value)}
                        rows={6}
                        placeholder="Enter your Complaint"
                    />
                </div>

                {/* Submit Button */}
                <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                        Submit
                    </button>
                    {submitted && (
                        <p className="text-green-600 mt-2">Complaint submitted successfully!</p>
                    )}
                </div>
            </form>
        </ComponentCard>
    );
}
