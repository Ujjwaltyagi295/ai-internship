import { FilterBar } from '@/components/filterBar'
import { Panel } from '@/components/Panel'
import JobsClient from './JobClient';


export default function JobsPage() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-hidden lg:pr-[300px]">
        <div className="flex flex-col h-full p-1 px-6 border-white/50 border bg-[#f2f4f5] rounded-4xl max-w-7xl mx-auto">

          <div className="pt-6 bg-[#f2f4f5]">
            <FilterBar />
          </div>
          <JobsClient />

        </div>
      </div>

      <div className="hidden lg:block fixed right-0 top-0 h-screen w-[300px] bg-white">
        <Panel />
      </div>
    </div>
  );
}
