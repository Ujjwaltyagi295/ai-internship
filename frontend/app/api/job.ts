import API from "@/config/apiClient";

export const Jobs = {
  getJobs: async () => {
    const response = await API.get("/students/me/recommendations");
    return response.data.recommendations;
  },
  getAdminJobs: async () => {
    const response = await API.get("/jobs");
    return response.data.jobs;
  },
  getJobApplications: async (jobId: string, statuses?: string[]) => {
    const params: any = {};
    if (statuses && statuses.length) {
      params.status = statuses.join(",");
    }
    const response = await API.get(`/applications/job/${jobId}`, { params });
    return response.data;
  },
  getJobById: async (jobId: string) => {
    const response = await API.get(`/jobs/${jobId}`);
    return response.data.job;
  },
  updateApplicationStatus: async (applicationId: string, status: string) => {
    const response = await API.patch(`/admin/applications/${applicationId}/status`, { status });
    return response.data;
  },
  createJobs: async(data)=>{
       const response = await API.post("/jobs/",{data});
    return response.data;
  },
  applyToJob: async (jobid: string, matchScore?: number) => {
    const payload: any = { jobId: jobid };
    if (typeof matchScore === "number") payload.matchScore = matchScore;
    const response = await API.post("/jobs/apply", payload);
    return response.data;
  },
  getAutofill: async (data: string) => {
    const response = await API.post("/jobs/autocreate", { text: data });
    return response.data.data;
  },
};
