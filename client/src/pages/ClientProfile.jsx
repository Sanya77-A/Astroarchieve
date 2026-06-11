import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MdArrowBack, MdPhone, MdEventNote, MdAccessTime, MdCheckCircle,
  MdSchedule, MdNotificationsActive, MdCalendarToday, MdLink, MdAdd
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
const modeEmojis = {
  'Phone Call': '📞', 'WhatsApp Call': '💬', 'Zoom': '💻', 'Google Meet': '📹', 'In-Person': '🤝',
};

const ClientProfile = () => {
  const { phone } = useParams();
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  const decodedPhone = decodeURIComponent(phone);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/clients/${encodeURIComponent(decodedPhone)}/consultations`);
        setConsultations(res.data);
      } catch {
        toast.error('Failed to load client profile');
        navigate('/clients');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [decodedPhone, navigate]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const clientName = consultations[0]?.clientName || 'Unknown Client';
  const totalHours = consultations.reduce((sum, c) => sum + c.duration, 0) / 60;
  const categories = [...new Set(consultations.map(c => c.category))];

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium transition-colors text-sm">
        <MdArrowBack className="w-4 h-4" /> Back to Clients
      </button>

      {/* Hero card */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-lg">
            <span className="text-white text-2xl font-bold">{clientName?.[0]?.toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-slate-900">{clientName}</h1>
            <div className="flex items-center gap-2 mt-1">
              <MdPhone className="w-4 h-4 text-slate-400" />
              <span className="text-slate-500">{decodedPhone}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {categories.map(cat => (
                <span key={cat} className={`badge ${categoryColors[cat] || 'badge-slate'}`}>{cat}</span>
              ))}
            </div>
          </div>
          <Link to="/consultations/add" className="btn-primary whitespace-nowrap">
            <MdAdd className="w-4 h-4" /> Add Session
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-800">{consultations.length}</p>
            <p className="text-xs text-slate-400 mt-1">Total Sessions</p>
          </div>
          <div className="text-center border-x border-slate-100">
            <p className="text-2xl font-bold text-slate-800">{parseFloat(totalHours.toFixed(1))}h</p>
            <p className="text-xs text-slate-400 mt-1">Total Hours</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-slate-800">
              {consultations[0]?.consultationDate
                ? new Date(consultations[0].consultationDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                : '—'}
            </p>
            <p className="text-xs text-slate-400 mt-1">Last Session</p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="card p-6">
        <h2 className="section-title mb-6">Consultation History</h2>
        {consultations.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-8">No consultations found for this client.</p>
        ) : (
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[18px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-200 to-slate-100"></div>

            <div className="space-y-6">
              {consultations.map((c, index) => {
                const sc = statusConfig[c.status] || statusConfig['Completed'];
                const StatusIcon = sc.icon;
                return (
                  <div key={c._id} className="relative flex gap-5 animate-fade-in" style={{ animationDelay: `${index * 60}ms` }}>
                    {/* Timeline dot */}
                    <div className="relative z-10 w-9 h-9 rounded-full bg-white border-2 border-indigo-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                    </div>

                    {/* Card */}
                    <div className="flex-1 card p-4 group hover:border-indigo-200 transition-colors mb-1">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-sm font-bold text-slate-800">{new Date(c.consultationDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                            <span className={`badge ${categoryColors[c.category] || 'badge-slate'}`}>{c.category}</span>
                            <span className={`badge ${sc.cls} flex items-center gap-1`}><StatusIcon className="w-3 h-3" />{c.status}</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                            <span>{modeEmojis[c.mode] || ''} {c.mode}</span>
                            <span className="flex items-center gap-1"><MdAccessTime className="w-3 h-3" />{c.duration} min</span>
                          </div>
                        </div>
                        <Link to={`/consultations/view/${c._id}`}
                          className="flex items-center gap-1 text-xs text-indigo-600 font-semibold hover:text-indigo-800 whitespace-nowrap">
                          View <MdArrowBack className="w-3 h-3 rotate-180" />
                        </Link>
                      </div>

                      {c.notes && (
                        <p className="mt-2 pt-2 border-t border-slate-100 text-xs text-slate-500 line-clamp-2">{c.notes}</p>
                      )}

                      {c.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {c.tags.map(tag => (
                            <span key={tag} className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full"># {tag}</span>
                          ))}
                        </div>
                      )}

                      {c.recordingLink && (
                        <a href={c.recordingLink} target="_blank" rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                          <MdLink className="w-3 h-3" /> Recording
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientProfile;
