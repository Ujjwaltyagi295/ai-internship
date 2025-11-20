import { FilterBar } from '@/components/filterBar'
import { JobCard } from '@/components/jobCard'
import { JobsHeader } from '@/components/jobHeader'
import { Panel } from '@/components/Panel'


export default function JobsPage() {
  const jobs = [
    {
      id: 1,
      title: 'AI/ML Software Engineer - Recent Gradu...',
      company: 'iTradeNetwork, Inc.',
      industry: 'Retail Technology',
      sector: 'SaaS',
      stage: 'Growth Stage',
      location: 'East Bay Area, CA',
      type: 'Full-time',
      level: 'New Grad, Entry Level',
      applicants: 89,
      matchScore: 91,
      isSponsor: true,
      growth: false,
      icon: '🌀',
      bgColor: 'from-yellow-50 to-orange-50'
    },
    {
      id: 2,
      title: 'Full Stack Engineer Intern (React and No...',
      company: 'ATC',
      industry: 'Animation',
      sector: 'Information Technology',
      stage: 'Growth Stage',
      location: 'Des Moines, IA',
      type: 'Internship',
      level: 'Intern',
      applicants: 150,
      matchScore: 97,
      isSponsor: true,
      growth: true,
      icon: '■',
      bgColor: 'from-gray-800 to-black'
    },
    {
      id: 3,
      title: 'Full Stack Software Engineer',
      company: 'SafeLease',
      industry: 'Insurance',
      sector: 'Growth Stage',
      stage: 'Growth Stage',
      location: 'San Francisco, CA',
      type: 'Full-time',
      level: 'Senior',
      applicants: 120,
      matchScore: 77,
      isSponsor: false,
      growth: false,
      icon: '◆',
      bgColor: 'from-blue-50 to-cyan-50'
    },
    {
      id: 4,
      title: 'Backend Engineer',
      company: 'TechCorp',
      industry: 'Software',
      sector: 'Technology',
      stage: 'Growth Stage',
      location: 'New York, NY',
      type: 'Full-time',
      level: 'Mid-Level',
      applicants: 200,
      matchScore: 85,
      isSponsor: true,
      growth: true,
      icon: '🚀',
      bgColor: 'from-purple-50 to-pink-50'
    }
  ]

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
     
      <div className="flex-1 overflow-hidden lg:pr-[300px]">
        <div className="flex flex-col h-full p-1 px-6 border-white/50 border bg-[#f2f4f5] rounded-4xl max-w-7xl mx-auto">
          <div className="pt-6 bg-[#f2f4f5]">
            <FilterBar />
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar pt-6 pb-6">
            <div className="flex flex-col gap-4">
              {jobs.map((job) => (
                <div key={job.id} className="min-h-[280px] lg:h-[calc((100vh-240px)/2.5)]">
                  <JobCard job={job} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="hidden lg:block fixed right-0 top-0 h-screen w-[300px] bg-white">
        <Panel />
      </div>
    </div>
  )
}
