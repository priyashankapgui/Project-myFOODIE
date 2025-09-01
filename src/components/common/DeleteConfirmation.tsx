"use client";

import Popup from "@/components/ui/popup/Popup";
import Button from "@/components/ui/button/Button";

interface DeleteConfirmationProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName?: string;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
    isOpen,
    onClose,
    onConfirm,
    itemName = "this item",
}) => {
    return (
        <Popup isOpen={isOpen} onClose={onClose} title="Delete Confirmation">
            <p className="text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to delete <span className="font-semibold">{itemName}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    onClick={() => {
                        onConfirm();
                        onClose();
                    }}
                    className="bg-red-500 hover:bg-red-700"
                >
                    Delete
                </Button>
            </div>
        </Popup>
    );
};

export default DeleteConfirmation;
