import axios from "axios";

const headers = {
  "Content-Type": "application/json",
};

const api = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/api`,
  headers,
  withCredentials: true,
});

const auth = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/auth`,
  headers,
  withCredentials: true,
});

export { api, auth };
