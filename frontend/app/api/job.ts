import API from "@/config/apiClient";

export const Jobs = {
  getJobs: async () => {
    const response = await API.get("/students/me/recommendations");
    return response.data.recommendations;
  },
}