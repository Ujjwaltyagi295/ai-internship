
import API from "@/config/apiClient";

export const students = {
 
  uploadResume: async (file: File) => {
    const formData = new FormData();
    formData.append("resume", file); 
    
    const response = await API.post("/students/me/resume", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        
      },
       timeout: 30000, 
    });
    
    return response.data;
  },

  deleteResume: async () => {
    const response = await API.delete("/students/me/resume");
    return response.data;
  },

  getMyResumeData: async () => {
    const response = await API.get("/students/me/resume");
    return response.data;
  },
  
};
