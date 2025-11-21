export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#f2f4f5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-8">
        <header className="flex flex-col gap-2">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
            Your Account
          </p>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Profile</h1>
              <p className="text-slate-600">
                Review your personal info, academic details, and resume status.
              </p>
            </div>
            <button className="inline-flex items-center justify-center rounded-full bg-slate-900 text-white px-4 py-2 text-sm font-semibold shadow-sm hover:bg-slate-800 transition">
              Save Changes
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 xl:col-span-2 space-y-6">
            <div className="flex items-baseline justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Basic Details</h2>
                <p className="text-sm text-slate-500">Keep your contact info up to date.</p>
              </div>
              <button className="text-sm font-medium text-slate-900 hover:underline">
                Edit
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase tracking-wide text-slate-500">Name</label>
                <input
                  className="rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  defaultValue="Student Name"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase tracking-wide text-slate-500">Email</label>
                <input
                  className="rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  defaultValue="you@college.edu"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase tracking-wide text-slate-500">Phone</label>
                <input
                  className="rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  placeholder="+91 99999 99999"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase tracking-wide text-slate-500">Location</label>
                <input
                  className="rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  placeholder="City, State"
                />
              </div>
            </div>
          </section>

          <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 space-y-6">
            <div className="flex items-baseline justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Academic</h2>
                <p className="text-sm text-slate-500">Stats used for eligibility.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Branch</span>
                <span className="text-sm font-semibold text-slate-900">CSE</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Batch</span>
                <span className="text-sm font-semibold text-slate-900">2025</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">CGPA</span>
                <span className="text-sm font-semibold text-slate-900">8.5</span>
              </div>
            </div>
            <button className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm font-medium text-slate-900 hover:border-slate-300">
              Update academic details
            </button>
          </section>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 space-y-4 lg:col-span-2">
            <div className="flex items-baseline justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Skills & Domains</h2>
                <p className="text-sm text-slate-500">These power recommendations.</p>
              </div>
              <button className="text-sm font-medium text-slate-900 hover:underline">
                Edit
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {["JavaScript", "React", "Node.js", "Data Structures", "SQL"].map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-slate-100 text-slate-800 px-3 py-1 text-xs font-semibold"
                >
                  {skill}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {["Web Development", "AI/ML"].map((domain) => (
                <span
                  key={domain}
                  className="rounded-full border border-slate-200 text-slate-800 px-3 py-1 text-xs font-semibold"
                >
                  {domain}
                </span>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 space-y-4">
            <div className="flex items-baseline justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Resume</h2>
                <p className="text-sm text-slate-500">Upload and keep it current.</p>
              </div>
            </div>
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-4 text-center space-y-2">
              <p className="text-sm font-semibold text-slate-900">resume.pdf</p>
              <p className="text-xs text-slate-500">Uploaded 2 days ago • Parsed</p>
              <button className="mt-2 inline-flex items-center justify-center rounded-lg bg-slate-900 text-white px-3 py-2 text-xs font-semibold hover:bg-slate-800 transition">
                Upload new resume
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
