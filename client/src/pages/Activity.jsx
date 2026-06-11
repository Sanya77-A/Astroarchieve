import React, { useState, useEffect } from 'react';
import { MdHistory, MdAddCircle, MdEdit, MdDelete, MdRefresh } from 'react-icons/md';
import toast from 'react-hot-toast';
import api from '../services/api';

const getActivityStyle = (message) => {
  if (message?.includes('added') || message?.includes('seeded') || message?.includes('created')) {
    return { dot: 'bg-emerald-400', ring: 'ring-emerald-100', icon: MdAddCircle, iconColor: 'text-emerald-600', bg: 'bg-emerald-50' };
  }
  if (message?.includes('deleted')) {
    return { dot: 'bg-rose-400', ring: 'ring-rose-100', icon: MdDelete, iconColor: 'text-rose-600', bg: 'bg-rose-50' };
  }
  return { dot: 'bg-blue-400', ring: 'ring-blue-100', icon: MdEdit, iconColor: 'text-blue-600', bg: 'bg-blue-50' };
};

const groupByDate = (activities) => {
  const groups = {};
  activities.forEach(act => {
    const date = new Date(act.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    if (!groups[date]) groups[date] = [];
    groups[date].push(act);
  });
  return groups;
};

const Activity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchActivities = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await api.get('/activities?limit=100');
      setActivities(res.data);
    } catch {
      toast.error('Failed to load activity');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchActivities(); }, []);

  const grouped = groupByDate(activities);

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
          <h1 className="page-title">Activity Log</h1>
          <p className="text-muted mt-1">{activities.length} total activities</p>
        </div>
        <button
          onClick={() => fetchActivities(true)}
          disabled={refreshing}
          className="btn-secondary"
        >
          <MdRefresh className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {activities.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-20 text-slate-400">
          <MdHistory className="w-14 h-14 mb-3 opacity-30" />
          <p className="font-semibold text-slate-600">No activity yet</p>
          <p className="text-sm mt-1">Activity will appear here as you manage consultations.</p>
        </div>
      ) : (
        <div className="max-w-2xl space-y-6">
          {Object.entries(grouped).map(([date, acts]) => (
            <div key={date} className="animate-fade-in">
              {/* Date header */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{date}</span>
                <div className="flex-1 h-px bg-slate-100"></div>
                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{acts.length}</span>
              </div>

              {/* Activities */}
              <div className="card divide-y divide-slate-50 overflow-hidden">
                {acts.map((act, i) => {
                  const style = getActivityStyle(act.message);
                  const Icon = style.icon;
                  return (
                    <div key={act._id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${style.bg}`}>
                        <Icon className={`w-4 h-4 ${style.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-700">{act.message}</p>
                      </div>
                      <p className="text-xs text-slate-400 whitespace-nowrap flex-shrink-0">
                        {new Date(act.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Activity;
