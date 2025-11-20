import API from "@/config/apiClient";

export const Jobs = {
  getJobs: async () => {
    const response = await API.get("/students/me/recommendations");
    return response.data.recommendations;
  },
  createJobs: async(data)=>{
       const response = await API.post("/jobs/",{data});
    return response.data;
  },
   applyToJob: async(jobid)=>{
       const response = await API.post("/jobs/apply",{ jobId: jobid });
    return response.data;
  },
  getAutofill: async (data: string) => {
    const response = await API.post("/jobs/autocreate", { text: data });
    return response.data.data;
  },
};
