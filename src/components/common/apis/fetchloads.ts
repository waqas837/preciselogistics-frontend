import axios from "axios";
import { backendUrl } from "../../../../lib/apiUrl";

export const fetchLoadsApi = async (id: string) => {
  const token = localStorage.getItem("driverToken");
  try {
    const response = await axios.get(`${backendUrl}/load-stops/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("response.data", response.data);
    if (response.data.success === "false") {
      return;
    }
    return response.data;
  } catch (err) {
    console.error("Failed to fetch loads", err);
  }
};
