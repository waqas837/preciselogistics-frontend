import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Package,
  CheckSquare,
  LogOut,
  User,
  PlusSquare,
  Truck,
  ChevronRight,
  PlusCircle,
  CreativeCommonsIcon,
} from "lucide-react";

interface SidebarProps {
  onLogout: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

type ActiveSection = "loads" | "create" | null;

const Sidebar = ({ onLogout, isOpen, onToggle }: SidebarProps) => {
  let driverName = localStorage.getItem("driverName");
  let driverEmail = localStorage.getItem("email");
  const [activeSection, setActiveSection] = useState<ActiveSection>(null);
  const location = useLocation();

  // Set active section based on URL
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("loads")) {
      setActiveSection("loads");
    } else if (path.includes("create")) {
      setActiveSection("create");
    } else {
      setActiveSection(null);
    }
  }, [location]);

  return (
    <>
      {/* Backdrop overlay when sidebar is open on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-20 lg:hidden transition-opacity duration-300"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full bg-white shadow-xl flex flex-col z-30
          transform transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          border-r border-gray-100 w-72`}
        aria-label="Sidebar navigation"
      >
        {/* Logo Area */}
        <div className="p-6 bg-gradient-to-r from-teal-600 to-teal-500">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Truck size={24} aria-hidden="true" />
              <span>LoadTracker</span>
            </h1>
            <button
              onClick={onToggle}
              className="p-1 rounded-full bg-teal-400 bg-opacity-20 text-white hover:bg-opacity-30 transition-all lg:hidden"
              aria-label="Toggle sidebar"
            >
              <ChevronRight size={20} aria-hidden="true" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md border border-white border-opacity-20">
              <User className="text-white" size={20} aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-medium text-white">{driverName}</h2>
              <p className="text-sm text-teal-100">{driverEmail}</p>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-4 py-5 overflow-y-auto scrollbar-thin">
          {/* Loads Section */}
          <div className="mb-6">
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Load Management
            </h3>
            <div className="space-y-1">
              <NavLink
                to="/active-loads"
                onClick={onToggle}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-teal-50 text-teal-600 font-medium shadow-sm"
                      : "text-gray-700 hover:bg-gray-50"
                  }`
                }
                end
              >
                <div
                  className={`p-1.5 rounded ${
                    activeSection === "loads" ? "bg-teal-100" : "bg-gray-100"
                  }`}
                >
                  <Package size={18} aria-hidden="true" />
                </div>
                <span>Active Loads</span>
              </NavLink>

              <NavLink
                to="/delivered-loads"
                onClick={onToggle}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-teal-50 text-teal-600 font-medium shadow-sm"
                      : "text-gray-700 hover:bg-gray-50"
                  }`
                }
                end
              >
                <div
                  className={`p-1.5 rounded ${
                    activeSection === "loads" ? "bg-teal-100" : "bg-gray-100"
                  }`}
                >
                  <CheckSquare size={18} aria-hidden="true" />
                </div>
                <span>Delivered Loads</span>
              </NavLink>
            </div>
          </div>

          {/* Create Section */}
          {/* <div className="mb-6">
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Create New
            </h3>
            <div className="space-y-1">
              <NavLink
                to="/create-load"
                onClick={onToggle}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                    ? 'bg-teal-50 text-teal-600 font-medium shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
                end
              >
                <div className={`p-1.5 rounded ${activeSection === 'create' ? 'bg-teal-100' : 'bg-gray-100'}`}>
                  <PlusSquare size={18} aria-hidden="true" />
                </div>
                <span>Create Load</span>
              </NavLink>

              <NavLink
                to="/create-stop-load"
                onClick={onToggle}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                    ? 'bg-teal-50 text-teal-600 font-medium shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
                end
              >
                <div className={`p-1.5 rounded ${activeSection === 'create' ? 'bg-teal-100' : 'bg-gray-100'}`}>
                  <PlusCircle size={18} aria-hidden="true" />
                </div>
                <span>Create Stop Load</span>
              </NavLink>

              <NavLink
                to="/create-broker"
                onClick={onToggle}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                    ? 'bg-teal-50 text-teal-600 font-medium shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
                end
              >
                <div className={`p-1.5 rounded ${activeSection === 'create' ? 'bg-teal-100' : 'bg-gray-100'}`}>
                  <CreativeCommonsIcon size={18} aria-hidden="true" />
                </div>
                <span>Create Broker</span>
              </NavLink>
            </div>
          </div> */}
        </nav>

        {/* Footer Area */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-white hover:shadow-sm transition-all w-full group"
            aria-label="Logout"
          >
            <div className="p-1.5 rounded bg-red-50 text-red-500 group-hover:bg-red-100 transition-colors">
              <LogOut size={18} aria-hidden="true" />
            </div>
            <span className="group-hover:text-red-600 transition-colors">
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
