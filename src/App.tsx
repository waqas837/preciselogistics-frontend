import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { Menu, X } from "lucide-react";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import ActiveLoads from "./components/ActiveLoads";
import DeliveredLoads from "./components/DeliveredLoads";
import CreateLoad from "./components/CreateLoad";
import CreateStopLoad from "./components/CreateStopLoad";
import Sidebar from "./components/Sidebar";
import LoadDetail from "./components/LoadDetail";
import CreateBroker from "./components/CreateBroker";

// Import logo image - make sure you have this file in your assets folder

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(() => {
    // Check localStorage for driverToken on initial render
    return Boolean(localStorage.getItem("driverToken"));
  });
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };
  useEffect(() => {
    function generateCustomUDID(): string {
      const nav = window.navigator;
      const screen = window.screen;

      const base = [
        nav.userAgent,
        nav.language,
        screen.height,
        screen.width,
        screen.colorDepth,
        new Date().getTimezoneOffset(),
      ].join("::");

      const hash = btoa(base)
        .replace(/[^a-zA-Z0-9]/g, "")
        .slice(0, 20); // Short & clean

      return hash;
    }

    // Save & reuse
    let deviceId = localStorage.getItem("device-uuid");
    if (!deviceId) {
      deviceId = generateCustomUDID();
      localStorage.setItem("device-uuid", deviceId);
    }

    return () => {};
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsSidebarOpen(false);
    localStorage.removeItem("driverToken");
    localStorage.removeItem("driverId");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar as overlay */}
        {isAuthenticated && (
          <>
            {/* Overlay backdrop when sidebar is open */}
            {isSidebarOpen && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-20"
                onClick={toggleSidebar}
              />
            )}
            <Sidebar
              onLogout={handleLogout}
              isOpen={isSidebarOpen}
              onToggle={toggleSidebar}
            />
          </>
        )}

        <div className="flex-1">
          <header className="bg-gradient-to-r from-teal-600 to-teal-500 shadow-lg sticky top-0 z-20">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-4">
                  {isAuthenticated && (
                    <button
                      onClick={toggleSidebar}
                      className="p-2 rounded-full bg-teal-700 hover:bg-teal-800 transition-colors text-white focus:outline-none focus:ring-2 focus:ring-white"
                    >
                      {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                  )}
                  <div className="flex items-center">
                    {/* Logo with white background circle for contrast */}
                    <div className="bg-white p-1 rounded-md">
                      <img
                        src={"logo.png"}
                        alt="TruckDriver Logo"
                        className="h-8 w-auto"
                      />
                    </div>
                    <h1 className="text-xl font-bold text-white tracking-wide ml-3 hidden sm:block">
                      TruckDriver PWA
                    </h1>
                  </div>
                </div>

                {isAuthenticated && (
                  <div className="hidden md:block">
                    {/* You can add navbar links here if needed */}
                  </div>
                )}
              </div>
            </div>
          </header>

          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route
                path="/signup"
                element={
                  !isAuthenticated ? (
                    <SignUp />
                  ) : (
                    <Navigate to="/active-loads" replace />
                  )
                }
              />
              <Route
                path="/login"
                element={
                  !isAuthenticated ? (
                    <Login onLogin={handleLogin} />
                  ) : (
                    <Navigate to="/active-loads" replace />
                  )
                }
              />
              <Route
                path="/active-loads"
                element={
                  isAuthenticated ? (
                    <ActiveLoads />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/delivered-loads"
                element={
                  isAuthenticated ? (
                    <DeliveredLoads />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/create-load"
                element={
                  isAuthenticated ? (
                    <CreateLoad />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/create-stop-load"
                element={
                  isAuthenticated ? (
                    <CreateStopLoad />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/create-broker"
                element={
                  isAuthenticated ? (
                    <CreateBroker />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/load/:id"
                element={
                  isAuthenticated ? (
                    <LoadDetail />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/"
                element={
                  isAuthenticated ? (
                    <Navigate to="/active-loads" replace />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
