import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MdSearch, MdEdit, MdDelete, MdVisibility, MdAdd, MdEventNote,
  MdFilterList, MdSort, MdPhone, MdCheckCircle, MdSchedule, MdNotificationsActive
} from 'react-icons/md';
import toast from 'react-hot-toast';
import api from '../services/api';

const categoryColors = {
  Career: 'badge-indigo', Marriage: 'badge-rose', Health: 'badge-emerald',
  Business: 'badge-blue', Education: 'badge-purple', Finance: 'badge-amber', General: 'badge-slate',
};
const statusConfig = {
  'Completed': { cls: 'badge-emerald', icon: MdCheckCircle },
  'Pending': { cls: 'badge-amber', icon: MdSchedule },
  'Follow-Up Required': { cls: 'badge-rose', icon: MdNotificationsActive },
};
const modeIcons = {
  'Phone Call': '📞', 'WhatsApp Call': '💬', 'Zoom': '💻', 'Google Meet': '📹', 'In-Person': '🤝',
};

const ConsultationList = () => {
  const [consultations, setConsultations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterMode, setFilterMode] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const fetchConsultations = async () => {
    try {
      const res = await api.get('/consultations');
      setConsultations(res.data);
    } catch (error) {
      toast.error('Failed to load consultations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchConsultations(); }, []);

  const handleDelete = async (id) => {
    setDeleteId(id);
    try {
      await api.delete(`/consultations/${id}`);
      toast.success('Consultation deleted');
      fetchConsultations();
    } catch (error) {
      toast.error('Failed to delete');
    } finally {
      setDeleteId(null);
    }
  };

  const filteredData = consultations
    .filter(c => {
      const q = searchTerm.toLowerCase();
      const matchSearch = c.clientName.toLowerCase().includes(q) || c.phone.includes(searchTerm);
      const matchCat = filterCategory ? c.category === filterCategory : true;
      const matchStatus = filterStatus ? c.status === filterStatus : true;
      const matchMode = filterMode ? c.mode === filterMode : true;
      return matchSearch && matchCat && matchStatus && matchMode;
    })
    .sort((a, b) => {
      const da = new Date(a.consultationDate);
      const db = new Date(b.consultationDate);
      return sortOrder === 'newest' ? db - da : da - db;
    });

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const activeFilters = [filterCategory, filterStatus, filterMode].filter(Boolean).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Consultations</h1>
          <p className="text-muted mt-1">{consultations.length} total records</p>
        </div>
        <Link to="/consultations/add" className="btn-primary">
          <MdAdd className="w-4 h-4" /> Add Consultation
        </Link>
      </div>

      {/* Filters bar */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 min-w-0">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
              className="form-input w-auto px-3 py-2 text-sm">
              <option value="">All Categories</option>
              {['Career','Marriage','Health','Business','Education','Finance','General'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
              className="form-input w-auto px-3 py-2 text-sm">
              <option value="">All Status</option>
              {['Completed','Pending','Follow-Up Required'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={filterMode} onChange={(e) => setFilterMode(e.target.value)}
              className="form-input w-auto px-3 py-2 text-sm">
              <option value="">All Modes</option>
              {['Phone Call','WhatsApp Call','Zoom','Google Meet','In-Person'].map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}
              className="form-input w-auto px-3 py-2 text-sm">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
            {activeFilters > 0 && (
              <button
                onClick={() => { setFilterCategory(''); setFilterStatus(''); setFilterMode(''); setSearchTerm(''); }}
                className="btn-secondary text-sm px-3 py-2 text-rose-600 border-rose-200 hover:bg-rose-50"
              >
                Clear ({activeFilters})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {filteredData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <MdEventNote className="w-14 h-14 mb-3 opacity-30" />
            <p className="font-semibold text-slate-600">No consultations found</p>
            <p className="text-sm mt-1">{consultations.length === 0 ? 'Create your first consultation to get started.' : 'Try adjusting your filters.'}</p>
            {consultations.length === 0 && (
              <Link to="/consultations/add" className="mt-4 btn-primary">Add Consultation</Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-100 bg-slate-50/60">
                <tr>
                  {['Client','Phone','Date','Duration','Category','Mode','Status','Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3.5 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredData.map(c => {
                  const sc = statusConfig[c.status] || statusConfig['Completed'];
                  const StatusIcon = sc.icon;
                  return (
                    <tr key={c._id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-5 py-3.5">
                        <Link to={`/consultations/view/${c._id}`} className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors text-sm block">{c.clientName}</Link>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-500 whitespace-nowrap">{c.phone}</td>
                      <td className="px-5 py-3.5 text-sm text-slate-600 whitespace-nowrap">{new Date(c.consultationDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">{c.duration}<span className="text-slate-400 ml-0.5 text-xs">m</span></td>
                      <td className="px-5 py-3.5"><span className={`badge ${categoryColors[c.category] || 'badge-slate'}`}>{c.category}</span></td>
                      <td className="px-5 py-3.5 text-sm text-slate-600 whitespace-nowrap">{modeIcons[c.mode] || ''} {c.mode}</td>
                      <td className="px-5 py-3.5">
                        <span className={`badge ${sc.cls} flex items-center gap-1 w-fit`}>
                          <StatusIcon className="w-3 h-3" />{c.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1">
                          <Link to={`/consultations/view/${c._id}`}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="View">
                            <MdVisibility className="w-4 h-4" />
                          </Link>
                          <Link to={`/consultations/edit/${c._id}`}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                            <MdEdit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(c._id)}
                            disabled={deleteId === c._id}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50" title="Delete">
                            <MdDelete className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="px-5 py-3 border-t border-slate-100 text-xs text-slate-400">
              Showing {filteredData.length} of {consultations.length} consultations
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultationList;
