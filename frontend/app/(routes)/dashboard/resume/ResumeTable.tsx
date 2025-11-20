
import UploadResume from '@/components/UploadResume'
import { Star, HelpCircle, MoreVertical } from 'lucide-react'

interface Resume {
  id: string
  name: string
  isPrimary: boolean
  targetJobTitle: string
  status: string
  lastModified: string
  created: string
  avatar: string
}

export default function ResumeTable() {
  const resumes: Resume[] = [
    {
      id: '1',
      name: 'UjjwalTyagi',
      isPrimary: true,
      targetJobTitle: '',
      status: 'Analysis Complete',
      lastModified: '4 days ago',
      created: '4 days ago',
      avatar: 'A'
    }
  ]

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
                You have <span className="font-bold">1</span> resume saved out of <span className="font-bold">5</span> available slots.
              </span>
              <button className="text-gray-500 hover:text-gray-700">
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>
            
            <UploadResume  />
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-bold text-gray-900">Resume</th>
                <th className="text-left px-6 py-4 text-sm font-bold text-gray-900">Target Job Title</th>
                <th className="text-left px-6 py-4 text-sm font-bold text-gray-900">Last Modified</th>
                <th className="text-left px-6 py-4 text-sm font-bold text-gray-900">Created</th>
                <th className="w-16"></th>
              </tr>
            </thead>
            <tbody>
              {resumes.map((resume) => (
                <tr key={resume.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-200 rounded-full flex items-center justify-center">
                        <span className="text-emerald-800 font-bold text-lg">{resume.avatar}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-900 font-medium">{resume.name}</span>
                        {resume.isPrimary && (
                          <div className="flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold">
                            <Star className="w-3 h-3 fill-emerald-700" />
                            PRIMARY
                            <HelpCircle className="w-3 h-3" />
                          </div>
                        )}
                        {resume.status && (
                          <div className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-medium">
                            {resume.status}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {resume.targetJobTitle || '-'}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {resume.lastModified}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {resume.created}
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-gray-400 hover:text-gray-600 p-1">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
