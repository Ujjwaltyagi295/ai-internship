
'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface ResumeDetailModalProps {
  resume: Resume | null
  isOpen: boolean
  onClose: () => void
}

export default function ResumeDetailModal({ resume, isOpen, onClose }: ResumeDetailModalProps) {
  if (!resume) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{resume.resumeMeta?.originalName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Summary */}
          {resume.resumeExtract?.summary && (
            <div>
              <h3 className="font-bold text-lg mb-2">Summary</h3>
              <p className="text-gray-700">{resume.resumeExtract.summary}</p>
            </div>
          )}

          {/* Skills */}
          <div>
            <h3 className="font-bold text-lg mb-2">Skills ({resume.resumeExtract?.skills?.length || 0})</h3>
            <div className="flex flex-wrap gap-2">
              {resume.resumeExtract?.skills?.map((skill, i) => (
                <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Tools */}
          {resume.resumeExtract?.tools?.length > 0 && (
            <div>
              <h3 className="font-bold text-lg mb-2">Tools</h3>
              <div className="flex flex-wrap gap-2">
                {resume.resumeExtract.tools.map((tool, i) => (
                  <span key={i} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {resume.resumeExtract?.experience?.length > 0 && (
            <div>
              <h3 className="font-bold text-lg mb-2">Experience</h3>
              <div className="space-y-3">
                {resume.resumeExtract.experience.map((exp: any, i: number) => (
                  <div key={i} className="border-l-2 border-emerald-500 pl-4">
                    <p className="font-semibold">{exp.title || exp.position}</p>
                    <p className="text-gray-600">{exp.company}</p>
                    <p className="text-sm text-gray-500">{exp.duration || exp.dates}</p>
                    {exp.description && <p className="mt-1 text-sm">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {resume.resumeExtract?.projects?.length > 0 && (
            <div>
              <h3 className="font-bold text-lg mb-2">Projects</h3>
              <div className="space-y-3">
                {resume.resumeExtract.projects.map((project: any, i: number) => (
                  <div key={i} className="border-l-2 border-blue-500 pl-4">
                    <p className="font-semibold">{project.name || project.title}</p>
                    <p className="text-sm text-gray-700">{project.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {resume.resumeExtract?.education?.length > 0 && (
            <div>
              <h3 className="font-bold text-lg mb-2">Education</h3>
              <div className="space-y-3">
                {resume.resumeExtract.education.map((edu: any, i: number) => (
                  <div key={i} className="border-l-2 border-yellow-500 pl-4">
                    <p className="font-semibold">{edu.degree}</p>
                    <p className="text-gray-600">{edu.institution}</p>
                    <p className="text-sm text-gray-500">{edu.year || edu.dates}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Parser Info */}
          {resume.parserInfo && (
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-bold text-sm mb-2">Parser Information</h3>
              <p className="text-xs text-gray-600">Engine: {resume.parserInfo.engine}</p>
              <p className="text-xs text-gray-600">Version: {resume.parserInfo.version}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
