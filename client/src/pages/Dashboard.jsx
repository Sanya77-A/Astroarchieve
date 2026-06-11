import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MdPeople, MdEventNote, MdToday, MdAccessTime, MdNotificationsActive,
  MdTrendingUp, MdArrowForward, MdCheckCircle, MdSchedule, MdInfo
} from 'react-icons/md';
import { FiPhone, FiVideo, FiMonitor, FiUsers, FiUser } from 'react-icons/fi';
import api from '../services/api';

const categoryColors = {
  Career: 'badge-indigo',
  Marriage: 'badge-rose',
  Health: 'badge-emerald',
  Business: 'badge-blue',
  Education: 'badge-purple',
  Finance: 'badge-amber',
  General: 'badge-slate',
};

const statusConfig = {
  'Completed': { cls: 'badge-emerald', icon: MdCheckCircle },
  'Pending': { cls: 'badge-amber', icon: MdSchedule },
  'Follow-Up Required': { cls: 'badge-rose', icon: MdNotificationsActive },
};

const StatCard = ({ title, value, icon: Icon, iconBg, trend, suffix = '' }) => (
  <div className="card card-hover p-5 animate-fade-in">
    <div className="flex items-start justify-between">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
        <Icon className="w-5 h-5" />
      </div>
      {trend !== undefined && (
        <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
          <MdTrendingUp className="w-3 h-3" />
          {trend}
        </div>
      )}
    </div>
    <div className="mt-4">
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <p className="text-3xl font-bold text-slate-800 mt-1">{value}<span className="text-lg font-medium text-slate-400 ml-1">{suffix}</span></p>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({ totalClients: 0, totalConsultations: 0, thisMonth: 0, totalHours: 0, upcomingFollowUps: 0 });
  const [activities, setActivities] = useState([]);
  const [recentConsultations, setRecentConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, consRes, actRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/consultations'),
          api.get('/activities?limit=6'),
        ]);
        setStats(statsRes.data);
        setRecentConsultations(consRes.data.slice(0, 6));
        setActivities(actRes.data);
      } catch (error) {
        console.error('Dashboard fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const statCards = [
    { title: 'Total Clients', value: stats.totalClients, icon: MdPeople, iconBg: 'bg-indigo-100 text-indigo-600' },
    { title: 'Total Consultations', value: stats.totalConsultations, icon: MdEventNote, iconBg: 'bg-emerald-100 text-emerald-600' },
    { title: 'This Month', value: stats.thisMonth, icon: MdToday, iconBg: 'bg-blue-100 text-blue-600' },
    { title: 'Total Hours', value: stats.totalHours, icon: MdAccessTime, iconBg: 'bg-violet-100 text-violet-600', suffix: 'hrs' },
    { title: 'Upcoming Follow-Ups', value: stats.upcomingFollowUps, icon: MdNotificationsActive, iconBg: 'bg-rose-100 text-rose-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="text-muted mt-1">Overview of your consultation practice</p>
        </div>
        <Link to="/consultations/add" className="btn-primary">
          + Add Consultation
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((s) => <StatCard key={s.title} {...s} />)}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent consultations */}
        <div className="xl:col-span-2 card">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h3 className="section-title">Recent Consultations</h3>
            <Link to="/consultations" className="text-sm text-indigo-600 font-semibold hover:text-indigo-800 flex items-center gap-1">
              View all <MdArrowForward className="w-4 h-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            {recentConsultations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                <MdEventNote className="w-12 h-12 mb-3 opacity-40" />
                <p className="font-medium">No consultations yet</p>
                <p className="text-sm">Create your first consultation to get started.</p>
                <Link to="/consultations/add" className="mt-4 btn-primary text-sm">Add Consultation</Link>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Client</th>
                    <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Date</th>
                    <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Category</th>
                    <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Duration</th>
                    <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentConsultations.map(c => {
                    const sc = statusConfig[c.status] || statusConfig['Completed'];
                    return (
                      <tr key={c._id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-5 py-3">
                          <Link to={`/consultations/view/${c._id}`} className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors text-sm">{c.clientName}</Link>
                          <p className="text-xs text-slate-400">{c.phone}</p>
                        </td>
                        <td className="px-5 py-3 text-sm text-slate-600">{new Date(c.consultationDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                        <td className="px-5 py-3"><span className={`badge ${categoryColors[c.category] || 'badge-slate'}`}>{c.category}</span></td>
                        <td className="px-5 py-3 text-sm text-slate-600">{c.duration} min</td>
                        <td className="px-5 py-3"><span className={`badge ${sc.cls}`}>{c.status}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Activity feed */}
        <div className="card">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h3 className="section-title">Recent Activity</h3>
            <Link to="/activity" className="text-sm text-indigo-600 font-semibold hover:text-indigo-800 flex items-center gap-1">
              View all <MdArrowForward className="w-4 h-4" />
            </Link>
          </div>
          <div className="p-5 space-y-4">
            {activities.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">No recent activity</p>
            ) : activities.map((act, i) => {
              const isAdded = act.message?.includes('added');
              const isDeleted = act.message?.includes('deleted');
              const dotColor = isAdded ? 'bg-emerald-400' : isDeleted ? 'bg-rose-400' : 'bg-blue-400';
              return (
                <div key={act._id} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${dotColor}`}></div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-700 leading-snug">{act.message}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{new Date(act.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
