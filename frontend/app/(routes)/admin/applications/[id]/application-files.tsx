"use client";

import { ExternalLink, File, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ApplicationAttachmentsProps {
  resumeUrl: string;
}

export function ApplicationAttachments({
  resumeUrl,
}: ApplicationAttachmentsProps) {
  if (!resumeUrl) return null;

  // 🟢 FIX: Cloudinary PDF Fix
  // If the URL contains '/raw/', replace it with '/image/'
  // This fixes the 404 error if the file was uploaded as an asset but saved with a raw URL.
  const safeViewerUrl = resumeUrl.replace("/raw/upload/", "/image/upload/");

  // Create a forced download link for backup
  const downloadUrl = safeViewerUrl.replace("/upload/", "/upload/fl_attachment/");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">Attachments</h3>
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 text-blue-500">
                <File className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-sm text-slate-900">Resume.pdf</p>
                <p className="text-xs text-slate-500">
                  <a 
                    href={downloadUrl} 
                    className="hover:underline text-blue-600"
                    download
                  >
                    Download Original
                  </a>
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              {/* View Button */}
              <a
                href={safeViewerUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Open Resume in New Tab"
                className="rounded-full cursor-pointer p-2 inline-flex items-center justify-center hover:bg-blue-100 transition-colors group"
              >
                <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}