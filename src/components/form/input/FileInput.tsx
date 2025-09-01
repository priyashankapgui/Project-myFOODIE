import React, { FC, useState, useRef } from "react";
import { uploadToCloudinary } from "@/utils/cloudinary";
import ComponentCard from "../../common/ComponentCard";

interface FileInputProps {
  className?: string;
  onUploadSuccess?: (fileUrl: string) => void;
  onUploadError?: (error: Error) => void;
  onUploadStart?: () => void;
  accept?: string;
  multiple?: boolean;
}

const FileInput: FC<FileInputProps> = ({
  className,
  onUploadSuccess,
  onUploadError,
  onUploadStart,
  accept = "image/*",
  multiple = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    onUploadStart?.();
    setIsUploading(true);

    try {
      // If multiple is false, only process the first file
      const filesToProcess = multiple ? Array.from(files) : [files[0]];

      for (const file of filesToProcess) {
        const fileUrl = await uploadToCloudinary(file);
        onUploadSuccess?.(fileUrl);
      }
    } catch (error) {
      console.error("Upload error:", error);
      onUploadError?.(error as Error);
    } finally {
      setIsUploading(false);
      // Reset the input
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const baseClasses = `focus:border-ring-brand-300 h-11 w-full overflow-hidden rounded-lg border border-gray-300 bg-transparent text-sm text-gray-500 shadow-theme-xs transition-colors file:mr-5 file:border-collapse file:cursor-pointer file:rounded-l-lg file:border-0 file:border-r file:border-solid file:border-gray-200 file:bg-gray-50 file:py-3 file:pl-3.5 file:pr-3 file:text-sm file:text-gray-700 placeholder:text-gray-400 hover:file:bg-gray-100 focus:outline-hidden focus:file:ring-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:text-white/90 dark:file:border-gray-800 dark:file:bg-white/[0.03] dark:file:text-gray-400 dark:placeholder:text-gray-400 ${className}`;

  return (
    <ComponentCard title="Upload Image">
      <div className="relative">
        <input
          ref={inputRef}
          type="file"
          className={baseClasses}
          onChange={handleFileChange}
          accept={accept}
          multiple={multiple}
          disabled={isUploading}
        />
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 dark:bg-gray-900 dark:bg-opacity-80">
            <div className="text-sm text-gray-600 dark:text-gray-300">Uploading...</div>
          </div>
        )}
      </div>
    </ComponentCard>
  );
};

export default FileInput;