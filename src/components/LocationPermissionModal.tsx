import { useEffect, useState } from "react";

export default function LocationPermissionModal() {
  const [showModal, setShowModal] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    const checkPermission = async () => {
      try {
        const result = await navigator.permissions.query({
          name: "geolocation" as PermissionName,
        });

        if (result.state === "granted") {
          setShowModal(false);
        } else if (result.state === "denied") {
          setShowModal(true);
        }
      } catch (error) {
        console.error("Permission check error:", error);
      }
    };

    const interval = setInterval(checkPermission, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleGotItClick = () => {
    setStatusMsg("Requesting location permission...");
    navigator.geolocation.getCurrentPosition(
      () => {
        setShowModal(false); // Access granted
        setStatusMsg("");
      },
      (error) => {
        console.error("Geolocation failed:", error);
        if (error.code === error.PERMISSION_DENIED) {
          setStatusMsg(
            "Permission is still denied. Please go to browser settings to enable location manually."
          );
        } else {
          setStatusMsg("Something went wrong trying to access location.");
        }
      },
      { enableHighAccuracy: true }
    );
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full space-y-4">
        <h2 className="text-xl font-semibold">Location Access Needed</h2>
        <p className="text-sm text-gray-600">
          To continue, we need access to your location so we can track your
          route.
        </p>

        <div className="bg-gray-100 rounded p-3 text-sm text-gray-700">
          <ul className="list-disc list-inside space-y-1">
            <li>
              Click the <strong>🔒 lock icon</strong> next to the site URL.
            </li>
            <li>
              Select <strong>"Site settings"</strong>.
            </li>
            <li>
              Under "Location", choose <strong>"Allow"</strong>.
            </li>
            <li>Then refresh the page.</li>
          </ul>
        </div>

        {statusMsg && (
          <p className="text-xs text-red-600 bg-red-100 rounded p-2">
            {statusMsg}
          </p>
        )}

        <button
          onClick={handleGotItClick}
          className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl py-2 text-sm font-medium"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
