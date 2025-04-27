import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  MoreVertical,
  Camera,
  FilePlus,
  X,
  Calendar,
  MapPin,
  Clock,
  Truck,
  ArrowRight,
  DollarSign,
  CheckCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { backendUrl } from "../../lib/apiUrl";
import axios from "axios";
import useS3Uploader from "./useS3Upload";
import toast, { Toaster } from "react-hot-toast";

// Modal component for uploading Bill of Landing
const UploadBillOfLandingModal = ({
  showModal,
  setShowModal,
  stopId,
}: {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  stopId: string | null;
}) => {
  const { setFiles, handleUpload } = useS3Uploader();
  const [showFile, setshowFile] = useState<any>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles: any = Array.from(e.target.files || []);
    setFiles(selectedFiles);
    setshowFile(selectedFiles);
    console.log("selectedFiles", selectedFiles);
  };

  const handleUploadClick = async () => {
    try {
      if (!stopId) {
        console.error("No stop ID provided");
        return;
      }

      const urls = await handleUpload();
      console.log("Uploaded Bill of Landing Files:", urls);

      const token = localStorage.getItem("driverToken");
      const apiUrl = `${backendUrl}/load-stops/stop/${stopId}`;

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

      setShowModal(false);
    } catch (error) {
      console.error("Error during BOL upload:", error);
    }
  };

  return (
    <AnimatePresence>
      <Toaster />
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
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
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-800 hover:bg-gray-100 p-1 rounded-full"
              >
                <X size={20} />
              </button>
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
                onClick={() => setShowModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadClick}
                className="flex-1 bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-3 px-4 rounded-xl hover:from-teal-700 hover:to-emerald-700 flex items-center justify-center gap-2"
              >
                <ArrowRight size={18} />
                <span>Upload Documents</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Modal for Lumper Input
const AddLumperModal = ({
  showModal,
  setShowModal,
  stopId,
}: {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  stopId: string | null;
}) => {
  const [amount, setAmount] = useState("");
  const [brokerPaid, setBrokerPaid] = useState<"yes" | "no">("yes");
  const [showmeFile, setshowmeFile] = useState<any>(null);
  const { setFiles, handleUpload } = useS3Uploader();

  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles([file]);
      setshowmeFile(file);
    }
  };

  //  handleSubmit function
  const handleSubmit = async () => {
    try {
      if (!stopId) {
        console.error("No stop ID provided");
        return;
      }

      const urls = await handleUpload();
      console.log("Uploaded Receipt URL:", urls[0]);

      const token = localStorage.getItem("driverToken");
      const apiUrl = `${backendUrl}/load-stops/stop/${stopId}`;

      // Build request body dynamically
      const requestBody: any = {};

      if (brokerPaid !== undefined && brokerPaid !== null) {
        requestBody.fee_lumper_paid_broker = brokerPaid === "yes" ? 1 : 0;
      }

      if (amount) {
        requestBody.fee_lumper = amount;
      }

      if (urls[0]) {
        requestBody.lumper_document = urls[0]; // or bol_document if needed
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
      console.log("API response:", result);
      if (result.success === "false") {
        toast.error("Error in Submit the data.");
        setShowModal(false);
        return;
      }
      if (result.success === "true") {
        toast.success("Data submitted successfully.");
        setShowModal(false);
        return;
      }
    } catch (error) {
      console.error("Error during handleSubmit:", error);
    }
  };

  return (
    <AnimatePresence>
      <Toaster />
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
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
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                  <DollarSign size={20} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Add Lumper Details
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-800 hover:bg-gray-100 p-1 rounded-full"
              >
                <X size={20} />
              </button>
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
                  />
                  <label
                    htmlFor="receipt-file"
                    className="cursor-pointer block"
                  >
                    <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                      <Camera size={24} className="text-blue-500" />
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
                onClick={() => setShowModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 px-4 rounded-xl hover:from-indigo-700 hover:to-blue-700 flex items-center justify-center gap-2"
              >
                <CheckCircle size={18} />
                <span>Submit Details</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const LoadDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [loadDetails, setloadDetails] = useState([]);
  const [activeStopId, setActiveStopId] = useState<string | null>(null);
  const [showBillModal, setShowBillModal] = useState(false);
  const [showLumperModal, setShowLumperModal] = useState(false);
  const [activeOptionsIndex, setActiveOptionsIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    const fetchLoads = async () => {
      const token = localStorage.getItem("driverToken");
      try {
        const response = await axios.get(`${backendUrl}/load-stops/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("response.data", response.data);
        if (response.data.success === "false") {
          setloadDetails([]);
          return;
        }
        // let mockupData: any = [
        //   {
        //     id_load_stop: "278",
        //     stop_type: "Pickup",
        //     address: "3553 fowler st fort myers, fl 33901",
        //     date_stop: "03/19/2025",
        //     time_note: "9am",
        //     bol_document: "",
        //     lumper_document: "",
        //   },
        //   {
        //     id_load_stop: "279",
        //     stop_type: "Delivery",
        //     address: "1234 w 5th ave new york, ny ",
        //     date_stop: "03/22/2025",
        //     time_note: "5PM",
        //     bol_document: "",
        //     lumper_document: "",
        //   },
        // ];
        setloadDetails(response.data);
        // setloadDetails(mockupData);
     
      } catch (err) {
        console.error("Failed to fetch loads", err);
      }
    };

    fetchLoads();
  }, [id]);

  // Toggle options menu for a specific delivery stop
  const toggleOptionsMenu = (index: number, stopId: string) => {
    if (activeOptionsIndex === index) {
      setActiveOptionsIndex(null);
    } else {
      setActiveOptionsIndex(index);
      setActiveStopId(stopId);
    }
  };

  // Open Bill of Lading modal
  const openBillModal = () => {
    setShowBillModal(true);
    setActiveOptionsIndex(null);
  };

  // Open Lumper Details modal
  const openLumperModal = () => {
    setShowLumperModal(true);
    setActiveOptionsIndex(null);
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Load Details</h1>
            <p className="text-gray-500">Tracking information for load #{id}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-teal-50 rounded-lg text-teal-600">
              <Truck size={20} />
            </div>
            <span className="font-medium text-gray-700">In Transit</span>
          </div>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Pickup Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-teal-500 hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-gray-800">
                Pickup Details
              </h3>
              <div className="w-10 h-10 bg-teal-50 rounded-full flex items-center justify-center">
                <MapPin size={18} className="text-teal-500" />
              </div>
            </div>

            {loadDetails &&
              loadDetails.map(
                (val: any, index) =>
                  val.stop_type === "Pickup" && (
                    <div className="space-y-4" key={`pickup-${index}`}>
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600 mt-0.5">
                          <MapPin size={18} />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider">
                            Address
                          </p>
                          <p className="font-medium text-gray-800">
                            {val.address}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-amber-50 rounded-lg text-amber-600 mt-0.5">
                          <Calendar size={18} />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider">
                            Date
                          </p>
                          <p className="font-medium text-gray-800">
                            {val.date_stop}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-purple-50 rounded-lg text-purple-600 mt-0.5">
                          <Clock size={18} />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider">
                            Time
                          </p>
                          <p className="font-medium text-gray-800">
                            {val.time_note}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
              )}
          </motion.div>

          {/* Delivery Cards - One for each delivery stop */}
          {loadDetails &&
            loadDetails.map((val: any, index) =>
              val.stop_type === "Delivery" ? (
                <motion.div
                  key={`delivery-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                  className="relative bg-white rounded-2xl shadow-lg p-6 border-t-4 border-blue-500 hover:shadow-xl transition-all"
                >
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Delivery Details
                    </h3>
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                      <MapPin size={18} className="text-blue-500" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg text-blue-600 mt-0.5">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">
                          Address
                        </p>
                        <p className="font-medium text-gray-800">
                          {val.address}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-amber-50 rounded-lg text-amber-600 mt-0.5">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">
                          Date
                        </p>
                        <p className="font-medium text-gray-800">
                          {val.date_stop}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-purple-50 rounded-lg text-purple-600 mt-0.5">
                        <Clock size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">
                          Time
                        </p>
                        <p className="font-medium text-gray-800">
                          {val.time_note}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Dropdown menu */}
                  {/* <button
                    className="absolute top-6 right-6 text-gray-500 hover:text-gray-800 hover:bg-gray-100 p-2 rounded-full transition-colors"
                    onClick={() => toggleOptionsMenu(index, val.id_load_stop)}
                    aria-label="More options"
                  >
                    <MoreVertical size={20} />
                  </button> */}

                  {/* Options Menu */}
                  <AnimatePresence>
                    {activeOptionsIndex === index && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-6 top-16 bg-white border border-gray-200 shadow-xl rounded-xl z-10 w-56 overflow-hidden"
                      >
                        <button
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-gray-700 transition-colors"
                          onClick={openBillModal}
                        >
                          <div className="p-1.5 bg-teal-50 rounded-lg text-teal-600">
                            <FilePlus size={16} />
                          </div>
                          <span>Add Bill of Lading</span>
                        </button>
                        <button
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-gray-700 transition-colors"
                          onClick={openLumperModal}
                        >
                          <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
                            <DollarSign size={16} />
                          </div>
                          <span>Add Lumper Details</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : null
            )}
        </div>
      </div>

      {/* Modal for Bill of Landing */}
      <UploadBillOfLandingModal
        showModal={showBillModal}
        setShowModal={setShowBillModal}
        stopId={activeStopId}
      />

      {/* Modal for Lumper */}
      <AddLumperModal
        showModal={showLumperModal}
        setShowModal={setShowLumperModal}
        stopId={activeStopId}
      />
    </div>
  );
};

export default LoadDetail;
