"use client";

interface PopupProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    className?: string; // Add className prop
    overlayClassName?: string; // Optional overlay className
    contentClassName?: string; // Optional content container className
}

export default function Popup({
    isOpen,
    onClose,
    title,
    children,
    className = "",
    overlayClassName = "",
    contentClassName = ""
}: PopupProps) {
    if (!isOpen) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 ${overlayClassName}`}>
            <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6 ${className}`}>

                {/* Header */}
                <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className={`mt-4 text-gray-700 dark:text-gray-300 ${contentClassName}`}>
                    {children}
                </div>

            </div>
        </div>
    );
}