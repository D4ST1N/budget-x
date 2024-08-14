import axios from "axios";

const headers = {
  "Content-Type": "application/json",
};

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/api`,
  headers,
});

export const auth = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/auth`,
  headers,
});
