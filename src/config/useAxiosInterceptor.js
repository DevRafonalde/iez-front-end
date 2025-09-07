// config/useAxiosInterceptor.js
import { useEffect } from "react";
import api from "./api";

export const useAxiosInterceptor = (setIsAuthenticated) => {
  useEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (
          error.response &&
          error.response.status === 401 &&
          error.response.data?.message?.includes("Token inválido")
        ) {
          console.log("teste");
          
          localStorage.removeItem("token");
          setIsAuthenticated(false);   // 🔴 desloga na aplicação
          window.location.href = "/login"; // 🔴 força redirecionamento
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [setIsAuthenticated]);
};
