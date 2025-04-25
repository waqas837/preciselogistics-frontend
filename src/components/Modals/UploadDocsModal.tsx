import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import AddLumperForm from "../Forms/AddLumperForm";
import UploadBillOfLandingForm from "../Forms/UploadBillOfLandingForm";

const UploadDocsModal = ({
  showModal,
  setShowModal,
  currentLoad,
}: {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  currentLoad: any;
}) => {
  const [activeTab, setActiveTab] = useState<"bol" | "lumper">("bol");
  useEffect(() => {
    console.log("first render");
  }, []);

  return (
    <AnimatePresence>
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
            className="relative bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-gray-100 h-screen overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Upload Documents
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-800 hover:bg-gray-100 p-1 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b mb-4">
              <button
                onClick={() => setActiveTab("bol")}
                className={`flex-1 py-2 px-4 text-sm font-medium text-center ${
                  activeTab === "bol"
                    ? "border-b-2 border-teal-600 text-teal-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Bill of Lading
              </button>
              <button
                onClick={() => setActiveTab("lumper")}
                className={`flex-1 py-2 px-4 text-sm font-medium text-center ${
                  activeTab === "lumper"
                    ? "border-b-2 border-teal-600 text-teal-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Add Lumper
              </button>
            </div>

            {/* Tab Content Placeholder */}
            <div className="min-h-[100px] text-gray-500 text-center py-6">
              {activeTab === "bol" ? (
                <UploadBillOfLandingForm currentLoad={currentLoad} />
              ) : (
                <AddLumperForm currentLoad={currentLoad} />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UploadDocsModal;
