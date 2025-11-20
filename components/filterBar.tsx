import { Settings2, Edit } from 'lucide-react'

export function FilterBar() {
  const filters = [
    'Full Stack Engineer',
    'Within the US',
    'Full-time',
    'Internship',
    'Onsite',
    'Remote'
  ]

  const subFilters = [
    'Hybrid',
    'Intern/New Grad',
    'Entry Level',
    'Min $330k/yr'
  ]

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 flex-wrap flex-1">
          {filters.map((filter, idx) => (
            <button
              key={idx}
              className="px-3.5 py-1.5 bg-white rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 border border-gray-200 transition-colors"
            >
              {filter}
            </button>
          ))}
        </div>
        <button className="p-2 rounded-lg hover:bg-white border border-gray-200 transition-colors flex-shrink-0">
          <Settings2 className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {subFilters.map((filter, idx) => (
          <button
            key={idx}
            className="px-3 py-1 bg-white rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 border border-gray-200 transition-colors"
          >
            {filter}
          </button>
        ))}
        <button className="px-3 py-1 bg-teal-400 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors">
          <Edit className="w-3 h-3" />
          Edit Filters
        </button>
      </div>
    </div>
  )
}
