import ResumeTable from "@/app/(routes)/dashboard/resume/ResumeTable";
export default function Home({ children }) {
  return (
    <div className="flex flex-col h-screen bg-[#f2f4f5] rounded-3xl overflow-hidden">
      <div className="flex-grow overflow-auto">
        <ResumeTable />
      </div>
    </div>
  );
}
