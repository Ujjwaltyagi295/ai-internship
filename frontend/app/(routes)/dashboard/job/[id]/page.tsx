import JobPageClient from "./JobPageClient";

export default async function JobPage({ params }: { params: Promise<{ id: string }> }) {
  const resolved = await params;

  return (
    <div className="h-screen overflow-y-auto">
      <JobPageClient id={resolved.id} />
    </div>
  );
}
