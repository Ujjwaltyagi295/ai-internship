// app/resumes/page.tsx
"use client";

import { useGetResumeData } from '@/hooks/useResumeUpload';
import UploadResume from '@/components/UploadResume';
import { Star, HelpCircle, MoreVertical, FileText } from 'lucide-react';
import { useState } from 'react';
import ResumeDetailModal from '@/components/ResumeDetails';
import { formatDate } from '@/lib/date';

export default function ResumeTable() {
  const { data , isLoading, isError } = useGetResumeData();
  const [selectedResume, setSelectedResume] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
    const resumes = data?[data]:[];
 

  if (isLoading) {
    return (
      <div className="w-full bg-gray-50 min-h-screen p-6 flex items-center justify-center">
        <div className="text-gray-500">Loading resumes...</div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <span className="text-gray-900 font-medium">
                You have <span className="font-bold">{resumes.length}</span> resume saved out of <span className="font-bold">5</span> available slots.
              </span>
              <button className="text-gray-500 hover:text-gray-700">
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>
            
            <UploadResume />
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-bold text-gray-900">Resume</th>
                <th className="text-left px-6 py-4 text-sm font-bold text-gray-900">Skills</th>
                <th className="text-left px-6 py-4 text-sm font-bold text-gray-900">Experience</th>
                <th className="text-left px-6 py-4 text-sm font-bold text-gray-900">Last Modified</th>
                <th className="text-left px-6 py-4 text-sm font-bold text-gray-900">Created</th>
                <th className="w-16"></th>
              </tr>
            </thead>
            <tbody>
              {resumes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No resumes uploaded yet
                  </td>
                </tr>
              ) : (
                resumes?.map((resume: Resume, index: number) => (
                  <tr 
                    key={resume._id} 
                    className="border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => {
                      setSelectedResume(resume);
                      setIsModalOpen(true);
                    }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-200 rounded-full flex items-center justify-center">
                          <FileText className="w-5 h-5 text-emerald-800" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-900 font-medium">
                              {resume.resumeMeta?.originalName || 'Resume'}
                            </span>
                            {index === 0 && (
                              <div className="flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold">
                                <Star className="w-3 h-3 fill-emerald-700" />
                                PRIMARY
                              </div>
                            )}
                          </div>
                          {resume.parsedAt && (
                            <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-medium w-fit">
                              Analysis Complete
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {resume.resumeExtract?.skills?.slice(0, 3).map((skill: string, i: number) => (
                          <span key={i} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                            {skill}
                          </span>
                        ))}
                        {(resume.resumeExtract?.skills?.length || 0) > 3 && (
                          <span className="text-gray-500 text-xs">
                            +{resume.resumeExtract.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {resume.resumeExtract?.experience?.length || 0} positions
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                    { formatDate(String(resume.updatedAt))}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {formatDate(String(resume.createdAt))}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        className="text-gray-400 hover:text-gray-600 p-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add menu logic here
                        }}
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <ResumeDetailModal
          resume={selectedResume}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
}
