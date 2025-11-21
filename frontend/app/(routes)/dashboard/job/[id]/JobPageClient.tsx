"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGetJobById } from "@/hooks/useJobs";
import JobDetailPage from "../JobDetailPage";

export default function JobPageClient({ id }: { id: string }) {
  const router = useRouter();
  const { mutate: getJobById,data, isPending, isError } = useGetJobById();

  useEffect(() => {
    if (!id) return;

    getJobById(id);
  }, [id, getJobById]);

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex h-screen items-center justify-center">
        Job not found.
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => router.back()}
        className="absolute top-4 right-4 z-50 p-2 bg-white rounded-full shadow-md lg:hidden hover:bg-gray-100 transition"
      >
        <span className="text-xl font-bold text-gray-600">✕</span>
      </button>

      <JobDetailPage job={data} />
    </div>
  );
}
