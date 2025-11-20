"use client";

import { useState } from "react";
import { Upload, Plus, Loader2, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useResumeUpload } from "@/hooks/useResumeUpload";

interface UploadResumeProps {
  onUploadSuccess?: (data: any) => void;
}

export default function UploadResume({ onUploadSuccess }: UploadResumeProps) {
  const [open, setOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const uploadMutation = useResumeUpload();

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        setValidationError(null);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        setValidationError(null);
      }
    }
  };

  const validateFile = (file: File): boolean => {
    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    
    if (!allowedTypes.includes(file.type)) {
      setValidationError("Please upload a PDF or Word document (.pdf, .doc, .docx)");
      setSelectedFile(null);
      return false;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setValidationError("File size must be less than 10MB");
      setSelectedFile(null);
      return false;
    }

    return true;
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    uploadMutation.mutate(selectedFile, {
      onSuccess: (data) => {
        onUploadSuccess?.(data);
        setOpen(false);
        setSelectedFile(null);
        setValidationError(null);
        
        setTimeout(() => {
          uploadMutation.reset();
        }, 1000);
      },
    });
  };

  const handleCancel = () => {
    setOpen(false);
    setSelectedFile(null);
    setIsDragging(false);
    setValidationError(null);
    uploadMutation.reset();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed">
          <Plus className="w-5 h-5" />
          Add Resume
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload Resume</DialogTitle>
          <DialogDescription>
            Upload your resume to get started with job matching and analysis. Accepted formats: PDF, DOC, DOCX (Max 10MB)
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition ${
                isDragging
                  ? "bg-gray-100 border-emerald-500"
                  : validationError
                  ? "bg-red-50 border-red-300"
                  : "bg-gray-50 border-gray-300 hover:bg-gray-100"
              } ${uploadMutation.isPending ? "pointer-events-none opacity-50" : ""}`}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {uploadMutation.isPending ? (
                  <>
                    <Loader2 className="w-10 h-10 mb-4 text-emerald-500 animate-spin" />
                    <p className="mb-2 text-sm text-gray-700 font-semibold">
                      Uploading and analyzing resume...
                    </p>
                    <p className="text-xs text-gray-500">Please wait</p>
                  </>
                ) : (
                  <>
                    <Upload className="w-10 h-10 mb-4 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-700">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PDF, DOC, DOCX (MAX. 10MB)</p>
                  </>
                )}
                
                {selectedFile && !uploadMutation.isPending && (
                  <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <p className="text-sm text-emerald-700 font-medium">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-emerald-600 mt-1">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                )}
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                disabled={uploadMutation.isPending}
              />
            </label>
          </div>

          {/* Validation Error Message */}
          {validationError && (
            <div className="mt-3 flex items-start gap-2 text-red-600">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{validationError}</p>
            </div>
          )}

          {/* Upload Error Message */}
          {uploadMutation.isError && (
            <div className="mt-3 flex items-start gap-2 text-red-600">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium">
                {uploadMutation.error?.response?.data?.error || "Upload failed. Please try again."}
              </p>
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={handleCancel}
              disabled={uploadMutation.isPending}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploadMutation.isPending}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition flex items-center gap-2"
            >
              {uploadMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload Resume
                </>
              )}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
