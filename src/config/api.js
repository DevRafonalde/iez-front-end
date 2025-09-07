import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8601/api", // ajuste
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    console.log("teste 3");
    
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(error.response);
    console.log(error.response.status);
    console.log(error.response.data?.error);
    
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data?.error?.includes("Token inválido")
    ) {
      console.log("teste2");
      
      localStorage.removeItem("token");
      window.location.href = "/login"; // garante que vai pra login
    }
    return Promise.reject(error);
  }
);

export default api;
