import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdPeople, MdSearch, MdArrowForward, MdAccessTime, MdEventNote, MdPhone } from 'react-icons/md';
import toast from 'react-hot-toast';
import api from '../services/api';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await api.get('/clients');
        setClients(res.data);
      } catch {
        toast.error('Failed to load clients');
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  const filtered = clients.filter(c => {
    const q = searchTerm.toLowerCase();
    return c.clientName.toLowerCase().includes(q) || c.phone.includes(searchTerm);
  });

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Clients</h1>
          <p className="text-muted mt-1">{clients.length} unique client{clients.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/consultations/add" className="btn-primary">
          + New Consultation
        </Link>
      </div>

      {/* Search */}
      <div className="card p-4">
        <div className="relative max-w-md">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-9"
          />
        </div>
      </div>

      {/* Client grid */}
      {filtered.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-20 text-slate-400">
          <MdPeople className="w-14 h-14 mb-3 opacity-30" />
          <p className="font-semibold text-slate-600">No clients found</p>
          <p className="text-sm mt-1">{clients.length === 0 ? 'Add your first consultation to see clients here.' : 'Try a different search.'}</p>
          {clients.length === 0 && (
            <Link to="/consultations/add" className="mt-4 btn-primary">Add Consultation</Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((client) => (
            <Link
              key={client.phone}
              to={`/clients/${encodeURIComponent(client.phone)}`}
              className="card card-hover p-5 block group animate-fade-in"
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-md group-hover:shadow-lg transition-shadow">
                  <span className="text-white text-lg font-bold">{client.clientName?.[0]?.toUpperCase()}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors text-sm truncate">{client.clientName}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MdPhone className="w-3 h-3" />{client.phone}
                  </p>
                </div>
                <MdArrowForward className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors flex-shrink-0 mt-1" />
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2">
                <div className="text-center">
                  <p className="text-lg font-bold text-slate-800">{client.totalConsultations}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Sessions</p>
                </div>
                <div className="text-center border-x border-slate-100">
                  <p className="text-lg font-bold text-slate-800">{client.totalHours}h</p>
                  <p className="text-xs text-slate-400 mt-0.5">Total Hours</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-700">{client.lastConsultation ? new Date(client.lastConsultation).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—'}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Last Session</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Clients;
