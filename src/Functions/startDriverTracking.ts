// utils/startDriverTracking.ts
import axios from "axios";
import { backendUrl } from "../../lib/apiUrl";

export function startDriverTracking(driverId: number, driverToken: string) {
  const interval = setInterval(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const deviceId = localStorage.getItem("device-uuid");

          axios.post(
            `${backendUrl}/carriers/drivers/position`,
            {
              id_carrier_driver: driverId,
              latitude,
              longitude,
              deviceinfo: navigator.userAgent,
              udid: deviceId, // Replace with real one
              date_time_tracker: new Date().toISOString(),
              fetch_type: "auto",
            },
            {
              headers: {
                Authorization: `Bearer ${driverToken}`,
              },
            }
          );
        },
        (error) => {
          console.error("Geolocation error:", error);
        },
        { enableHighAccuracy: true }
      );
    }
  }, 10000); // Every 10 seconds

  return interval;
}
