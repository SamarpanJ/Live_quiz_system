import axios from "axios";

/** Same-origin API client; the admin session rides along as an httpOnly cookie. */
export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    return Promise.reject(err);
  },
);

/** Pulls a human-readable message out of an axios error. */
export function apiError(err: unknown, fallback = "Something went wrong."): string {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.error ?? err.message ?? fallback;
  }
  return fallback;
}
