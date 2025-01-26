import axios from "redaxios";

export default axios.create({
  baseURL: "http://localhost:8888", // Add protocol here
  headers: {
    "Content-Type": "application/json",
  },
});
