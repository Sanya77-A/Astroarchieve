import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import {
  MdDashboard, MdList, MdAddCircleOutline, MdPeople,
  MdHistory, MdMic, MdLogout, MdChevronLeft, MdChevronRight
} from 'react-icons/md';
import { AuthContext } from '../context/AuthContext';

const menuItems = [
  { path: '/', name: 'Dashboard', icon: MdDashboard, end: true },
  { path: '/consultations', name: 'Consultations', icon: MdList },
  { path: '/clients', name: 'Clients', icon: MdPeople },
  { path: '/activity', name: 'Activity', icon: MdHistory },
  { path: '/consultations/add', name: 'Add Consultation', icon: MdAddCircleOutline },
];

const Sidebar = ({ collapsed, setCollapsed }) => {
  const { logout, admin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div
      className={`relative flex flex-col h-full transition-all duration-300 ease-in-out ${
        collapsed ? 'w-16' : 'w-64'
      }`}
      style={{
        background: 'linear-gradient(180deg, #312e81 0%, #3730a3 40%, #4338ca 100%)',
      }}
    >
      {/* Toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-8 z-10 w-6 h-6 rounded-full bg-white border-2 border-indigo-200 flex items-center justify-center shadow-md hover:border-indigo-400 transition-colors"
      >
        {collapsed
          ? <MdChevronRight className="w-3 h-3 text-indigo-600" />
          : <MdChevronLeft className="w-3 h-3 text-indigo-600" />}
      </button>

      {/* Logo */}
      <div className={`flex items-center h-16 px-4 border-b border-indigo-600/40 ${collapsed ? 'justify-center' : 'gap-3'}`}>
        <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
          <MdMic className="w-5 h-5 text-emerald-400" />
        </div>
        {!collapsed && (
          <div>
            <h1 className="text-white font-bold text-sm leading-tight">Consultation</h1>
            <p className="text-indigo-300 text-xs">Manager</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-hidden">
        {!collapsed && (
          <p className="text-indigo-400 text-xs font-semibold uppercase tracking-widest px-3 mb-3">Navigation</p>
        )}
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              title={collapsed ? item.name : ''}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-white/20 text-white font-semibold shadow-sm'
                    : 'text-indigo-200 hover:bg-white/10 hover:text-white'
                } ${collapsed ? 'justify-center' : ''}`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-emerald-400' : ''
                  }`} />
                  {!collapsed && <span className="text-sm">{item.name}</span>}
                  {!collapsed && isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div className={`p-3 border-t border-indigo-600/40 ${ collapsed ? 'flex justify-center' : ''}` }>
        {!collapsed ? (
          <div>
            <div className="flex items-center gap-2 px-2 py-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">{admin?.email?.[0]?.toUpperCase() || 'A'}</span>
              </div>
              <div className="min-w-0">
                <p className="text-white text-xs font-semibold truncate">{admin?.email || 'Admin'}</p>
                <p className="text-indigo-300 text-xs">Administrator</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-indigo-200 hover:text-white hover:bg-white/10 rounded-xl transition-colors text-sm"
            >
              <MdLogout className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-2 text-indigo-200 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <MdLogout className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
