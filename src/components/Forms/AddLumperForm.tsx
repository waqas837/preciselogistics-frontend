import { useEffect, useState } from "react";
import useS3Uploader from "../useS3Upload";
import { AnimatePresence, motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { Camera, CheckCircle, DollarSign } from "lucide-react";
import { backendUrl } from "../../../lib/apiUrl";
import { fetchLoadsApi } from "../common/apis/fetchloads";

const AddLumperForm = ({ currentLoad }: { currentLoad: any }) => {
  const [amount, setAmount] = useState("");
  const [brokerPaid, setBrokerPaid] = useState<"yes" | "no">("yes");
  const [showmeFile, setshowmeFile] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stopid, setstopid] = useState(null);
  const { setFiles, handleUpload } = useS3Uploader();
  useEffect(() => {
    (async () => {
      if (currentLoad.id_load) {
        const loadData = await fetchLoadsApi(currentLoad.id_load);
        console.log("loadData", loadData[1].id_load_stop);
        setstopid(loadData[1].id_load_stop);
      }
    })();
  }, []);
  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles([file]);
      setshowmeFile(file);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (!stopid) {
        console.error("No stop ID provided");
        toast.error("No stop ID provided");
        return;
      }

      const urls = await handleUpload();
      console.log("Uploaded Receipt URL:", urls[0]);

      const token = localStorage.getItem("driverToken");
      const apiUrl = `${backendUrl}/load-stops/stop/${stopid}`;

      const requestBody: any = {};

      if (brokerPaid !== undefined && brokerPaid !== null) {
        requestBody.fee_lumper_paid_broker = brokerPaid === "yes" ? 1 : 0;
      }

      if (amount) {
        requestBody.fee_lumper = amount;
      }

      if (urls[0]) {
        requestBody.lumper_document = urls[0];
      }

      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        toast.error("Error in Submit the data.");
        throw new Error("Failed to update with uploaded URL");
      }

      const result = await response.json();
      if (result.success === "true") {
        toast.success("Data submitted successfully.");
      } else {
        toast.error("Error in Submit the data.");
      }
    } catch (error) {
      console.error("Error during handleSubmit:", error);
    } finally {
      setIsSubmitting(false);
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
              <DollarSign size={20} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">
              Add Lumper Details
            </h3>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Broker Paid Lumper
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setBrokerPaid("yes")}
                className={`p-3 rounded-lg border ${
                  brokerPaid === "yes"
                    ? "border-teal-500 bg-teal-50 text-teal-700"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setBrokerPaid("no")}
                className={`p-3 rounded-lg border ${
                  brokerPaid === "no"
                    ? "border-teal-500 bg-teal-50 text-teal-700"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                No
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Receipt
            </label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center bg-gray-50">
              <input
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                id="receipt-file"
                onChange={handleReceiptChange}
                required
              />
              <label htmlFor="receipt-file" className="cursor-pointer block">
                <div className="mx-auto w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-4">
                  <Camera size={24} className="text-teal-500" />
                </div>
                <span className="text-sm text-gray-600">
                  {showmeFile
                    ? showmeFile.name
                    : "Click to upload receipt image"}
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`flex-1 bg-gradient-to-r from-teal-600 to-teal-600 text-white py-3 px-4 rounded-xl 
              flex items-center justify-center gap-2 
              ${
                isSubmitting
                  ? "opacity-60 cursor-not-allowed"
                  : "hover:from-teal-700 hover:to-teal-700"
              }`}
          >
            {isSubmitting ? (
              <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : (
              <CheckCircle size={18} />
            )}
            <span>{isSubmitting ? "Uploading..." : "Submit Details"}</span>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddLumperForm;
