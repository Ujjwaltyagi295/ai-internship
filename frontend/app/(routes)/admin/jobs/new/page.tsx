"use client"

import JobForm from "./JobForm"


export default function Home() {
  return (
    <main className="min-h-screen  py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Job Posting</h1>
          <p className="text-gray-600">Add a new job opportunity with AI-powered autofill</p>
        </div>
        <JobForm />
      </div>
    </main>
  )
}
