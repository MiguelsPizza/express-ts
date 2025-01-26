import axios from "redaxios";

export default axios.create({
  baseURL: "http://localhost:8888/api", // Add protocol here
  headers: {
    "Content-Type": "application/json",
  },
});
