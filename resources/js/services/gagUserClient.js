import axios from "axios";

let apiUrl = "";
 
// apiUrl = "http://loginextuatadmin.grandiose.ae";
 apiUrl = process.env.MIX_BASE_URL;
 
const gagUserClient = axios.create({
  baseURL: apiUrl,
//   withCredentials: true,
});

export default gagUserClient;
