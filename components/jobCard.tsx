"use client"
import { Ban, Heart, MessageCircle } from 'lucide-react'
import { RadialProgress } from './ui/RadialProgress'

interface JobCardProps {
  job: {
    id: number
    title: string
    company: string
    industry: string
    sector: string
    stage: string
    location: string
    type: string
    level: string
    applicants: number
    matchScore: number
    isSponsor: boolean
    growth: boolean
    icon: string
    bgColor: string
  }
}

export function JobCard({ job }: JobCardProps) {
  const timePosted = job.id === 1 ? '14 hours ago' : job.id === 2 ? '10 hours ago' : '2 days ago'

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition overflow-hidden h-full flex flex-col">
      <div className="flex flex-col lg:flex-row lg:gap-4 p-4 lg:p-6 flex-1">
        
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-start gap-3 mb-3 lg:mb-4">
            <div className={`w-12 h-12 lg:w-20 lg:h-20 rounded-lg bg-gradient-to-br ${job.bgColor} flex items-center justify-center text-xl lg:text-3xl font-bold flex-shrink-0`}>
              {job.icon}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs lg:text-sm text-gray-500">{timePosted}</span>
                <button className="lg:hidden p-1 hover:bg-gray-100 rounded">
                  <span className="text-xl text-gray-400">•••</span>
                </button>
              </div>
              <h3 className="text-base lg:text-xl lg:leading-tight font-bold text-gray-900 line-clamp-2 mb-1">
                {job.title}
              </h3>
              <div className="text-xs lg:text-base lg:leading-tight text-gray-500 line-clamp-1 mb-2">
                {job.company} / {job.industry} · {job.sector} · {job.stage}
              </div>
            </div>

            <button className="hidden lg:block p-1 hover:bg-gray-100 rounded flex-shrink-0">
              <span className="text-2xl text-gray-400">•••</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-2 mb-3 text-xs lg:text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <span className="truncate">United States</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="truncate">Remote</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="truncate">Intern</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="truncate">Internship</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs lg:text-sm text-gray-600 mb-3 lg:mb-0">
            <span>{job.applicants}+ applicants</span>
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center justify-between pt-3 border-t border-gray-200 mt-auto">
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-50 rounded-full transition">
                <Ban className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-50 rounded-full transition">
                <Heart className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-900">STRONG MATCH</span>
                {/* Mobile: 48px with text at ~14px (30% of size) */}
                <RadialProgress 
                  value={job.matchScore} 
                  size={48} 
                  strokeWidth={4}
                  textColor="#000"
                />
              </div>
              <button className="p-1 hover:bg-gray-100 rounded">
                <span className="text-xl text-gray-400">•••</span>
              </button>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3 pt-4 border-t border-gray-200 mt-auto">
            <button className="p-2 hover:bg-gray-50 rounded-full transition">
              <Ban className="w-6 h-6 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-50 rounded-full transition">
              <Heart className="w-6 h-6 text-gray-600" />
            </button>
            <button className="px-4 py-2 rounded-lg border border-gray-300 text-base font-semibold text-gray-900 hover:bg-gray-50 flex items-center gap-2 transition">
              <MessageCircle className="w-5 h-5" />
              ASK ORION
            </button>
            <button className="ml-auto px-6 py-2 bg-teal-400 hover:bg-teal-500 cursor-pointer text-white rounded-full text-base font-bold transition">
              APPLY NOW
            </button>
          </div>
        </div>

        {/* Desktop Match Score Card */}
        <div className="hidden lg:flex flex-shrink-0 w-48 bg-gradient-to-b from-black to-[#00485f] rounded-xl p-6 flex-col items-center justify-between text-white">
          <div className="flex flex-col items-center justify-center flex-1">
            {/* Desktop: 112px with text at ~34px (30% of size) */}
            <RadialProgress 
              value={job.matchScore} 
              size={112} 
              strokeWidth={8}
              className="mb-4"
            />

            <div className="text-center text-sm font-bold">
              STRONG MATCH
            </div>
          </div>

          <div className="space-y-2 w-full">
            {job.growth && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-green-400">✓</span>
                <span>Growth Opportunities</span>
              </div>
            )}
            {job.isSponsor && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-green-400">✓</span>
                <span>H1B Sponsor Likely</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
