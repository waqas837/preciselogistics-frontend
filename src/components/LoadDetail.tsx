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

const LoadDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [loadDetails, setloadDetails] = useState([]);
  const [activeStopId, setActiveStopId] = useState<string | null>(null);
  const [showBillModal, setShowBillModal] = useState(false);
  const [showLumperModal, setShowLumperModal] = useState(false);
  const [activeOptionsIndex, setActiveOptionsIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchLoads = async () => {
      const token = localStorage.getItem("driverToken");
      try {
        const response = await axios.get(`${backendUrl}/load-stops/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success === "false") {
          setloadDetails([]);
          return;
        }
        setloadDetails(response.data);
      } catch (err) {
        console.error("Failed to fetch loads", err);
      }
    };

    fetchLoads();
  }, [id]);

  const toggleOptionsMenu = (index: number, stopId: string) => {
    if (activeOptionsIndex === index) {
      setActiveOptionsIndex(null);
    } else {
      setActiveOptionsIndex(index);
      setActiveStopId(stopId);
    }
  };

  const openBillModal = () => {
    setShowBillModal(true);
    setActiveOptionsIndex(null);
  };

  const openLumperModal = () => {
    setShowLumperModal(true);
    setActiveOptionsIndex(null);
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Load Details</h1>
            <p className="text-gray-500">Tracking information for load #{id}</p>
          </div>
          <div className="flex items-center gap-2">
            {/* <div className="p-2 bg-teal-50 rounded-lg text-teal-600">
              <Truck size={20} />
            </div> */}
            {/* <span className="font-medium text-gray-700">In Transit</span> */}
          </div>
        </motion.div>

        {/* Details Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Pickup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-teal-500 hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-gray-800">Pickup Details</h3>
              <div className="w-10 h-10 bg-teal-50 rounded-full flex items-center justify-center">
                <MapPin size={18} className="text-teal-500" />
              </div>
            </div>

            {loadDetails &&
              loadDetails.map((val: any, index) =>
                val.stop_type === "Pickup" ? (
                  <div className="space-y-4" key={`pickup-${index}`}>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg text-blue-600 mt-0.5">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Address</p>
                        <p className="font-medium text-gray-800">{val.address}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-amber-50 rounded-lg text-amber-600 mt-0.5">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Date</p>
                        <p className="font-medium text-gray-800">{val.date_stop}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-purple-50 rounded-lg text-purple-600 mt-0.5">
                        <Clock size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Time</p>
                        <p className="font-medium text-gray-800">{val.time_note}</p>
                      </div>
                    </div>
                  </div>
                ) : null
              )}
          </motion.div>

          {/* Deliveries */}
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
                    <h3 className="text-lg font-semibold text-gray-800">Delivery Details</h3>
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
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Address</p>
                        <p className="font-medium text-gray-800">{val.address}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-amber-50 rounded-lg text-amber-600 mt-0.5">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Date</p>
                        <p className="font-medium text-gray-800">{val.date_stop}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-purple-50 rounded-lg text-purple-600 mt-0.5">
                        <Clock size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Time</p>
                        <p className="font-medium text-gray-800">{val.time_note}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : null
            )}

        </div>
        {loadDetails.some((val: any) => val.bol_document || val.lumper_document) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="mt-10 bg-white rounded-2xl shadow-lg p-6 border-t-4 border-green-500 hover:shadow-xl transition-all max-w-4xl mx-auto text-left"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FilePlus size={20} className="text-green-600" />
                Uploaded Documents
              </h3>
            </div>

            <div>
              {loadDetails.map((val: any, index: number) => (
                <div
                  key={`docs-${index}`}
                  className="text-left flex flex-col gap-4"
                >
                  {val.bol_document && (
                    <a
                      href={val.bol_document}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border hover:shadow-sm transition group"
                    >
                      <div className="p-2 bg-green-100 rounded-lg">
                        <FilePlus size={20} className="text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800 group-hover:underline">
                          Bill of Lading
                        </p>
                        <p className="text-xs text-gray-500">Click to view</p>
                      </div>
                    </a>
                  )}

                  {val.lumper_document && (
                    <a
                      href={val.lumper_document}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 mt-3 rounded-lg bg-gray-50 border hover:shadow-sm transition group"
                    >
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <FilePlus size={20} className="text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800 group-hover:underline">
                          Lumper Receipt
                        </p>
                        <p className="text-xs text-gray-500">Click to view</p>
                      </div>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}


      </div>
    </div>
  );
};

export default LoadDetail;
