import React from 'react';
import { NavLink } from 'react-router-dom';
import { Package, CheckSquare } from 'lucide-react';

const Navigation = () => {
  return (
    <nav className="flex gap-4">
      <NavLink
        to="/active-loads"
        className={({ isActive }) =>
          `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
            isActive ? 'bg-teal-600-700' : 'hover:bg-teal-600-700'
          }`
        }
      >
        <Package size={20} />
        <span>Active Loads</span>
      </NavLink>
      <NavLink
        to="/delivered-loads"
        className={({ isActive }) =>
          `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
            isActive ? 'bg-teal-600-700' : 'hover:bg-teal-600-700'
          }`
        }
      >
        <CheckSquare size={20} />
        <span>Delivered Loads</span>
      </NavLink>
    </nav>
  );
};

export default Navigation