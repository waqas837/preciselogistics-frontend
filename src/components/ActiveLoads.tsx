import { useState, useEffect, useRef } from "react";
import {
  MapPin,
  DollarSign,
  MoreVertical,
  X,
  Truck,
  CheckCircle,
  CreditCard,
  Upload,
  Check,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../../lib/apiUrl";
import { startDriverTracking } from "../Functions/startDriverTracking";
import { stopDriverTracking } from "../Functions/stopDriverTracking";
import toast, { Toaster } from "react-hot-toast";
import LocationPermissionModal from "./LocationPermissionModal";
import UploadDocsModal from "./Modals/UploadDocsModal";

interface Load {
  id_load: number;
  load_number: string;
  broker_name: string;
  status: string;
  pickup_address: string;
  date_pickup: string;
  time_pickup: string;
  delivery_address: string;
  date_delivery: string;
  time_delivery: string;
  due_amount?: number;
}


// updateLoadStatus

const updateLoadStatus = async (idLoad: any) => {
  const token = localStorage.getItem("driverToken"); // Replace with actual JWT token

  try {
    const response = await axios.put(
      `${backendUrl}/loads/${idLoad}`,
      {
        id_status: 3, // Example: status ID to update to
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Response:", response.data);
    toast.success("Load marked as completed.");
    window.location.reload();
  } catch (error) {
    toast.error("Internal server error.");
    console.error("Error:", error);
  }
};

const ActiveLoads = () => {
  const [loads, setLoads] = useState<Load[]>([]);
  const [selectedLoad, setSelectedLoad] = useState<Load | null>(null);
  const [showOptions, setShowOptions] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [dueAmount, setDueAmount] = useState<number | null>(null);
  const [rateLoading, setRateLoading] = useState<boolean>(false);
  // setShowModalDocs
  const [showModalDocs, setShowModalDocs] = useState(false);
  const navigate = useNavigate();

  // track bol doc and lumper doc
  const [bolDoc, setBolDoc] = useState<string | null>(null);
  const [lumperDoc, setLumperDoc] = useState<string | null>(null);
  useEffect(() => {
    const fetchLoads = async () => {
      // /load-stops/
      setLoading(true);
      const token = localStorage.getItem("driverToken");
      const driverId = localStorage.getItem("driverId");

      try {
        const response = await axios.get(
          `${backendUrl}/loads-on/drivers/${driverId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // let mockdata: any = [
        //   {
        //     id_load: "118",
        //     load_number: "1234567898",
        //     broker_name: "COYOTE LOGISTICS",
        //     status: "Pickup Pending",
        //     pickup_address: "3553 fowler st fort myers, fl 33901",
        //     date_pickup: "03/19/2025",
        //     time_pickup: "9am",
        //     delivery_address: "1234 w 5th ave new york, ny ",
        //     date_delivery: "03/22/2025",
        //     time_delivery: "5PM",
        //   },
        //   {
        //     id_load: "115",
        //     load_number: "1234567",
        //     broker_name: "COYOTE LOGISTICS",
        //     status: "Pickup Pending",
        //     pickup_address:
        //       "10041 Daniels Parkway,  Fort Myers,  FL 33913,  USA",
        //     date_pickup: "03/21/2025",
        //     time_pickup: "8am - 10am",
        //     delivery_address:
        //       "956 Northwest 10th Avenue,  Miami,  FL 33136,  USA",
        //     date_delivery: "03/24/2025",
        //     time_delivery: "anytime",
        //   },
        // ];
        // Filter for loads that are either pending or dispatched (active)
        const pendingLoads = response.data.filter(
          (load: any) =>
            load.status === "Pending" ||
            load.status === "Pickup Pending" ||
            load.status === "Dispatched" ||
            load.status === "On its way" ||
            load.status === "On Its way" ||
            load.status === "On Its Way" ||
            load.status === "In Progress"
        );
        // const pendingLoads = mockdata.filter(
        //   (load: any) =>
        //     load.status === "Pickup Pending" ||
        //     load.status === "Dispatched" ||
        //     load.status === "In Progress"
        // );
        setLoads(pendingLoads);




      } catch (err) {
        // setError("Failed to fetch loads");
      } finally {
        setLoading(false);
      }
    };

    fetchLoads();


  }, []);

  const handleViewRate = async (load: Load) => {
    setSelectedLoad(load);
    setShowModal(true);
    setShowOptions(null);
    setRateLoading(true);
    setDueAmount(null);
    try {
      const token = localStorage.getItem("driverToken");
      const response = await axios.get(
        `${backendUrl}/loads/payment/${load.id_load}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("response", response);
      setDueAmount(response.data.amount_due);
    } catch (err) {
      console.error("Failed to fetch rate:", err);
    } finally {
      setRateLoading(false);
    }
  };

  const handlePaymentClick = (load: Load) => {
    navigate(`/load/${load.id_load}`, { state: load });
  };

  const closeModal = () => {
    setShowModal(false);
    setDueAmount(null);
    setRateLoading(false);
  };

  const uploadDocsHandler = (load: Load) => {
    setSelectedLoad(load);
    setShowOptions(null);
    setShowModalDocs(true);
  };

  const dropdownCheckPlusApiHandler = async (
    e: React.MouseEvent<HTMLButtonElement>,
    load: Load
  ) => {
    e.stopPropagation();
    setShowOptions((prev) => (prev === load.id_load ? null : load.id_load));
    // we have call an api to get the load details
    const token = localStorage.getItem("driverToken");
    try {
      const { data } = await axios.get(
        `${backendUrl}/load-stops/${load.id_load}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      let bol_doc = data[1].bol_document;
      let lumper_doc = data[1].lumper_document;
      setBolDoc(bol_doc);
      setLumperDoc(lumper_doc);
      console.log("data", data);
      console.log("data we may need", bol_doc, lumper_doc);

    } catch (err) {
      console.error("Failed to fetch loads");
    }
  };
  return (
    <div className="space-y-6 p-4 sm:p-6">
      <Toaster />
      <LocationPermissionModal />
      <UploadDocsModal
        showModal={showModalDocs}
        setShowModal={setShowModalDocs}
        currentLoad={selectedLoad}
      />
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Active Loads</h2>
        <span className="text-sm text-gray-500">
          {loads.length} active loads
        </span>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loads.map((load) => (
          <motion.div
            key={load.id_load}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-teal-50 rounded-lg text-teal-600">
                  <Truck size={20} />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Load #{load.load_number}
                </h3>
              </div>

              <div className="flex gap-2 items-center">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {load.status}
                </span>
                <button
                  onClick={(e) => {
                    dropdownCheckPlusApiHandler(e, load);

                  }}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <MoreVertical
                    className="text-gray-500 hover:text-gray-800"
                    size={18}
                  />
                </button>
              </div>

              <AnimatePresence>
                {showOptions === load.id_load && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-4 top-12 bg-white border border-gray-200 shadow-lg rounded-xl z-10 w-48 overflow-hidden"
                  >
                    <button
                      onClick={() => handleViewRate(load)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2 text-sm"
                    >
                      <DollarSign size={16} className="text-gray-500" />
                      View Rate
                    </button>
                    <button
                      onClick={() => handlePaymentClick(load)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2 text-sm"
                    >
                      <CreditCard size={16} className="text-gray-500" />
                      Details
                    </button>

                    {/* It is necassary to upload the documents. else mark as delivery buttion will be disabled */}
                    {bolDoc && lumperDoc ? <button
                      onClick={() => {
                        updateLoadStatus(load.id_load);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2 text-sm"
                    >
                      <Check size={16} className="text-gray-500" />
                      Mark as Delivered
                    </button> : <button
                      disabled={true}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2 text-sm"
                    >
                      <Check size={16} className="text-gray-300" />
                      <p className="text-gray-300">Mark as Delivered</p>
                    </button>}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600 mt-0.5">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    Pickup
                  </p>
                  <p className="font-medium text-gray-800">
                    {load.pickup_address}
                  </p>
                  <p className="text-sm text-gray-500">
                    {load.date_pickup} at {load.time_pickup}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-50 rounded-lg text-green-600 mt-0.5">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    Delivery
                  </p>
                  <p className="font-medium text-gray-800">
                    {load.delivery_address}
                  </p>
                  <p className="text-sm text-gray-500">
                    {load.date_delivery} at {load.time_delivery}
                  </p>
                </div>
              </div>
            </div>
            {/* mark as deliverd has been ccommented so find a way to mark as delivered */}
            {/* <button
              onClick={() => {
                updateLoadStatus(load.id_load);
              }}
              className="mt-6 w-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-3 px-4 rounded-xl hover:from-teal-700 hover:to-emerald-700 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <CheckCircle size={18} />
              <span>Mark as Delivered</span>
            </button> */}
            <button
              onClick={() => uploadDocsHandler(load)}
              className="mt-6 w-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-3 px-4 rounded-xl hover:from-teal-700 hover:to-emerald-700 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Upload size={16} className="text-white" />
              <span>Upload Documents</span>
            </button>




          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && selectedLoad && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-teal-50 rounded-xl text-teal-600">
                  <Truck size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Load #{selectedLoad.load_number}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Broker: {selectedLoad.broker_name}
                  </p>
                </div>
              </div>

              {rateLoading ? (
                <p className="text-center text-gray-500">Loading rate...</p>
              ) : dueAmount !== null ? (
                <p className="text-center text-2xl font-semibold text-gray-800">
                  Due Amount:{" "}
                  <span className="text-emerald-600">${dueAmount}</span>
                </p>
              ) : (
                <p className="text-center text-gray-500">
                  Rate info not available.
                </p>
              )}

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    handlePaymentClick(selectedLoad);
                    closeModal();
                  }}
                  className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <CreditCard size={18} />
                  <span>Payment</span>
                </button>
                <button
                  onClick={closeModal}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ActiveLoads;
