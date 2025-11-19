import { ChevronDown } from 'lucide-react';

export function JobsHeader({ section }) {
  const isJobsSection = section === "Jobs";

  return (
    <div className="bg-white px-6 py-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-gray-900 font-extrabold text-[26px]">
            {section.toUpperCase()}
            <ChevronDown className="w-4 h-4" />
            
            {/* Only show these buttons if section is "Jobs" */}
            {isJobsSection && (
              <>
                <button className="px-3 py-1 rounded-full bg-black text-white text-sm font-semibold">
                  Recommended
                </button>
                <button className="px-3 py-1 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-full">
                  Liked <span className="ml-1 bg-black text-white px-2 rounded-full text-xs">0</span>
                </button>
                <button className="px-3 py-1 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-full">
                  Applied <span className="ml-1 bg-black text-white px-2 rounded-full text-xs">0</span>
                </button>
                <button className="px-3 py-1 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-full">
                  External <span className="ml-1 bg-black text-white px-2 rounded-full text-xs">0</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
