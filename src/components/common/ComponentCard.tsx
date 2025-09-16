import React from "react";
import Button from "@/components/ui/button/Button";
import { FiPlusCircle } from "react-icons/fi";

interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string; // Additional custom classes for styling
  desc?: string; // Description text
  handleClick?: () => void;
  showButton?: boolean;
  newButtonLabel?: string;
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  children,
  className = "",
  newButtonLabel = "New",
  desc = "",
  handleClick,
  showButton = false,
}) => {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      {/* Card Header */}
      <div className="px-6 py-5">
        <div className="flex justify-between ">
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
            {title}
          </h3>
          {desc && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {desc}
            </p>
          )}

          {showButton && (
            <Button size="sm" variant="outline" startIcon={<FiPlusCircle />} onClick={handleClick} >
              {newButtonLabel}
            </Button>
          )}

        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default ComponentCard;
