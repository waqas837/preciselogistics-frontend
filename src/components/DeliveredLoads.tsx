import { useState, useEffect } from "react";
import {
  DollarSign,
  CheckCircle,
  Truck,
  FileText,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { backendUrl } from "../../lib/apiUrl";
import { Link } from "react-router-dom";

interface Load {
  id_load: number;
  load_number: string;
  pickup_address: string;
  delivery_address: string;
  date_pickup: string;
  time_pickup: string;
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

const DeliveredLoads = () => {
  const [loads, setLoads] = useState<Load[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchDeliveredLoads = async () => {
      setLoading(true);
      setError("");

      try {
        const driverId = localStorage.getItem("driverId");
        const token = localStorage.getItem("driverToken");

        const response = await fetch(
          `${backendUrl}/loads-delivered/drivers/${driverId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();

        if (data && data.length > 0) {
          setLoads(data);
        } else {
          setError("No delivered loads found");
        }
      } catch (err) {
        setError("Error fetching data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveredLoads();
  }, []);

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

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
          {loads.map((load, index) => (
            <motion.div
              key={load.id_load}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden"
            >
              <div className="p-4">
                <div className="space-y-3">
                  {/* Header with load number and details link */}
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-gray-500 text-xs">LOAD NUMBER:</div>
                      <div className="text-teal-700 font-bold text-2xl">{load.load_number}</div>
                    </div>
                    <Link
                      to={`/load/${load.id_load}`}
                      className="text-teal-600 hover:text-teal-800"
                      title="View Load Details"
                    >
                      <ExternalLink size={22} />
                    </Link>
                  </div>

                  {/* Broker and status */}
                  <div className="flex justify-between items-center">
                    <div className="text-gray-500 text-sm">{load.broker_name}</div>
                    <div className="flex items-center gap-2">
                      <div className="text-teal-500">
                        <DollarSign size={20} />
                      </div>
                      <span className="bg-teal-500 text-white px-4 py-1 rounded-full text-sm">
                        Delivered
                      </span>
                    </div>
                  </div>

                  {/* Pickup info */}
                  <div className="flex items-start gap-2">
                    <Truck size={18} className="text-teal-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-teal-700 font-medium text-sm">Pickup Address</div>
                      <div className="text-gray-600 text-sm">{load.pickup_address}</div>
                    </div>
                    <div className="bg-teal-600 text-white text-xs px-2 py-1 rounded text-center flex-shrink-0">
                      {load.date_pickup}<br />{load.time_pickup}
                    </div>
                  </div>

                  {/* Delivery info */}
                  <div className="flex items-start gap-2">
                    <Truck size={18} fill="currentColor" className="text-teal-700 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-teal-700 font-medium text-sm">Delivery Address</div>
                      <div className="text-gray-600 text-sm">{load.delivery_address}</div>
                    </div>
                    <div className="bg-teal-600 text-white text-xs px-2 py-1 rounded text-center flex-shrink-0">
                      {load.date_delivery}<br />{load.time_delivery}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeliveredLoads;
