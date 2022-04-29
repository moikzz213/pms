import axios from "axios";

let apiUrl = "";
 
apiUrl = process.env.MIX_SENTRY_DSN_PUBLIC;
let ls = localStorage.getItem('auth_token');

const apiClient = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
  headers: {
    Authorization: "Bearer "+ls,
    Accept: 'application/json',
    "Content-Type": "application/json",
  }
});
export default apiClient;