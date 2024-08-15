import { useUserStore } from "@/store/user";
import axios from "axios";

const headers = {
  "Content-Type": "application/json",
};

const api = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/api`,
  headers,
});

api.interceptors.request.use(
  (config) => {
    const userStore = useUserStore();
    const userId = userStore.user?.user_id;

    if (userId) {
      config.headers["userId"] = userId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const auth = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/auth`,
  headers,
});

export { api, auth };
