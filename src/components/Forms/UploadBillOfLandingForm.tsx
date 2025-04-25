import { useEffect, useState } from "react";
import useS3Uploader from "../useS3Upload";
import { AnimatePresence, motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { ArrowRight, FilePlus } from "lucide-react";
import { backendUrl } from "../../../lib/apiUrl";
import { fetchLoadsApi } from "../common/apis/fetchloads";

const UploadBillOfLandingForm = ({ currentLoad }: { currentLoad: any }) => {
  const { setFiles, handleUpload } = useS3Uploader();
  const [showFile, setshowFile] = useState<any>([]);
  const [isUploading, setIsUploading] = useState(false); // Track upload state
  const [stopid, setstopid] = useState(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles: any = Array.from(e.target.files || []);
    setFiles(selectedFiles);
    setshowFile(selectedFiles);
    console.log("selectedFiles", selectedFiles);
  };

  useEffect(() => {
    (async () => {
      if (currentLoad.id_load) {
        const loadData = await fetchLoadsApi(currentLoad.id_load);
        console.log("loadData", loadData[1].id_load_stop);
        setstopid(loadData[1].id_load_stop);
      }
    })();
  }, []);

  const handleUploadClick = async () => {
    console.log("stopid", stopid);
    //  return
    if (!currentLoad) return; // Ensure currentLoad is defined
    if (isUploading) return; // Prevent multiple uploads at once
    setIsUploading(true); // Start the uploading process
    try {
      if (!stopid) {
        console.error("No stop ID provided");
        toast.error("No stop ID provided");
        return;
      }
      if (showFile.length === 0) {
        toast.error("Please select a file to upload.");
        return;
      }

      const urls = await handleUpload();
      console.log("Uploaded Bill of Landing Files:", urls);

      const token = localStorage.getItem("driverToken");
      const apiUrl = `${backendUrl}/load-stops/stop/${stopid}`;

      // Only send if URL exists
      if (urls[0]) {
        const response = await fetch(apiUrl, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            bol_document: urls[0],
          }),
        });

        const result = await response.json();
        console.log("BOL upload API response:", result);
        if (result.success === "true") {
          toast.success("Document uploaded successfully.");
        }
        if (!response.ok || result.success !== "true") {
          toast.error("Error to upload document.");
          throw new Error("Failed to upload BOL document.");
        }
      }
    } catch (error) {
      console.error("Error during BOL upload:", error);
    } finally {
      setIsUploading(false); // Reset upload state
    }
  };

  return (
    <AnimatePresence>
      <Toaster />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", damping: 20 }}
        className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-50 rounded-lg text-teal-600">
              <FilePlus size={20} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">
              Upload Bill of Lading
            </h3>
          </div>
        </div>

        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 mb-6 text-center bg-gray-50">
          <div className="mx-auto w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-4">
            <FilePlus size={24} className="text-teal-500" />
          </div>
          <p className="text-gray-600 mb-3">
            {showFile.length
              ? showFile[0].name
              : "Drag & drop files or click to browse"}
          </p>
          <p className="text-xs text-gray-500 mb-4">
            Supports JPG, PNG, PDF (Max 10MB)
          </p>
          <input
            type="file"
            multiple
            accept="image/*,.pdf"
            onChange={handleFileChange}
            className="hidden"
            id="bill-files"
            required
          />
          <label
            htmlFor="bill-files"
            className="px-5 py-2.5 bg-teal-600 text-white rounded-lg cursor-pointer inline-block font-medium hover:bg-teal-700 transition-colors"
          >
            Select Files
          </label>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleUploadClick}
            disabled={isUploading} // Disable button when uploading
            className={`flex-1 bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-3 px-4 rounded-xl 
              ${
                isUploading
                  ? "opacity-60 cursor-not-allowed"
                  : "hover:from-teal-700 hover:to-emerald-700"
              }
              flex items-center justify-center gap-2`}
          >
            {isUploading ? (
              <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : (
              <ArrowRight size={18} />
            )}
            <span>{isUploading ? "Uploading..." : "Upload Documents"}</span>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UploadBillOfLandingForm;
