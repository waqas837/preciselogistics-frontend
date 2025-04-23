import { useState, useEffect } from "react";
import axios from "axios";
import {
  MapPin,
  Calendar,
  DollarSign,
  CheckCircle,
  Truck,
  ArrowRight,
  FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { backendUrl } from "../../lib/apiUrl";

interface Load {
  id_load: number;
  load_number: string;
  pickup_address: string;
  delivery_address: string;
  date_delivery: string;
  time_delivery: string;
  broker_name: string;
  status: string;
  documents?: string[];
}

interface Document {
  bol_document: string;
  lumper_document: string;
}

const DeliveredLoads: React.FC = () => {
  const [loads, setLoads] = useState<Load[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [selectedLoad, setSelectedLoad] = useState<number | null>(null);
  const [loadDocuments, setLoadDocuments] = useState<{
    [key: number]: Document | null;
  }>({});

  const handleDownload = (fileUrl: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  useEffect(() => {
    const fetchDeliveredLoads = async () => {
      setLoading(true);
      setError("");

      try {
        const driverId = localStorage.getItem("driverId");
        const token = localStorage.getItem("driverToken");
        const response = await axios.get(
          `${backendUrl}/loads-delivered/drivers/${driverId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data && response.data.length > 0) {
          setLoads(response.data);
        } else {
          setError("No delivered loads found");
        }
      } catch (err: any) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveredLoads();
  }, []);

  const fetchDocuments = async (loadId: number) => {
    try {
      const token = localStorage.getItem("driverToken");
      const response = await axios.get(`${backendUrl}/load-stops/${loadId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data) {
        const documents = response.data.reduce(
          (acc: Document, current: any) => {
            acc.bol_document = current.bol_document || "";
            acc.lumper_document = current.lumper_document || "";
            return acc;
          },
          { bol_document: "", lumper_document: "" }
        );
        setLoadDocuments((prev) => ({ ...prev, [loadId]: documents }));
      }
    } catch (err) {
      console.error("Error fetching documents:", err);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Delivered Loads
            </h1>
            <p className="text-gray-500">
              Your successfully completed shipments
            </p>
          </div>
          <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full">
            <CheckCircle size={18} className="text-green-600" />
            <span className="text-sm font-medium text-green-700">
              {loads.length} Completed Loads
            </span>
          </div>
        </motion.div>

        {loading && <p className="text-gray-600">Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loads.map((load, index) => (
            <motion.div
              key={load.id_load}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-teal-50 rounded-lg text-teal-600">
                      <Truck size={18} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Load #{load.load_number}
                    </h3>
                  </div>
                  <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2.5 py-1 rounded-full text-xs font-medium">
                    <CheckCircle size={14} />
                    <span>Delivered</span>
                  </span>
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
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-amber-50 rounded-lg text-amber-600 mt-0.5">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">
                        Delivery Date
                      </p>
                      <p className="font-medium text-gray-800">
                        {load.date_delivery} {load.time_delivery}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-50 rounded-lg text-purple-600 mt-0.5">
                      <DollarSign size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">
                        Broker
                      </p>
                      <p className="font-medium text-gray-800">
                        {load.broker_name}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 p-4 bg-gray-50">
                <button
                  onClick={() => {
                    if (selectedLoad !== load.id_load) {
                      setSelectedLoad(load.id_load);
                      fetchDocuments(load.id_load);
                    } else {
                      setSelectedLoad(null);
                    }
                  }}
                  className="w-full flex items-center justify-between text-gray-700 hover:text-teal-600 transition-colors"
                >
                  <span className="text-sm font-medium">View Documents</span>
                  <ArrowRight
                    size={18}
                    className={`transition-transform ${
                      selectedLoad === load.id_load ? "rotate-90" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {selectedLoad === load.id_load && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 space-y-2">
                        {loadDocuments[load.id_load] ? (
                          <>
                            {loadDocuments[load.id_load]?.bol_document && (
                              <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200">
                                <FileText size={16} className="text-gray-500" />
                                <span className="text-sm text-gray-700">
                                  {loadDocuments[load.id_load]?.bol_document}
                                </span>
                                <button
                                  onClick={() =>
                                    handleDownload(
                                      loadDocuments[load.id_load]
                                        ?.bol_document || "",
                                      `BOL_${load.load_number}.${loadDocuments[
                                        load.id_load
                                      ]?.bol_document
                                        ?.split(".")
                                        .pop()}`
                                    )
                                  }
                                  className="ml-auto text-xs text-teal-600 hover:text-teal-800 font-medium"
                                >
                                  Preview
                                </button>
                              </div>
                            )}
                            {loadDocuments[load.id_load]?.lumper_document && (
                              <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200">
                                <FileText size={16} className="text-gray-500" />
                                <span className="text-sm text-gray-700">
                                  {loadDocuments[load.id_load]?.lumper_document}
                                </span>
                                <button
                                  onClick={() =>
                                    handleDownload(
                                      loadDocuments[load.id_load]
                                        ?.lumper_document || "",
                                      `Lumper_${
                                        load.load_number
                                      }.${loadDocuments[
                                        load.id_load
                                      ]?.lumper_document
                                        ?.split(".")
                                        .pop()}`
                                    )
                                  }
                                  className="ml-auto text-xs text-teal-600 hover:text-teal-800 font-medium"
                                >
                                  Preview
                                </button>
                              </div>
                            )}
                          </>
                        ) : (
                          <p className="text-gray-500">
                            No documents available
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeliveredLoads;
