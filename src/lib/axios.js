import axios from "axios";

export const api = axios.create({
  baseURL: "https://pre-moldado-deploy-test.onrender.com",
});
