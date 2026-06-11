import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MdArrowBack, MdEdit, MdLink, MdAccessTime, MdPhone, MdDownload,
  MdCheckCircle, MdSchedule, MdNotificationsActive, MdCalendarToday,
  MdCategory, MdDevices, MdLabel, MdNotes
} from 'react-icons/md';
import toast from 'react-hot-toast';
import api from '../services/api';

const categoryColors = {
  Career: 'badge-indigo', Marriage: 'badge-rose', Health: 'badge-emerald',
  Business: 'badge-blue', Education: 'badge-purple', Finance: 'badge-amber', General: 'badge-slate',
};
const statusConfig = {
  'Completed': { cls: 'badge-emerald', icon: MdCheckCircle, label: 'Completed' },
  'Pending': { cls: 'badge-amber', icon: MdSchedule, label: 'Pending' },
  'Follow-Up Required': { cls: 'badge-rose', icon: MdNotificationsActive, label: 'Follow-Up Required' },
};
const modeEmojis = {
  'Phone Call': '📞', 'WhatsApp Call': '💬', 'Zoom': '💻', 'Google Meet': '📹', 'In-Person': '🤝',
};

const InfoItem = ({ icon: Icon, label, value, accent }) => (
  <div className="flex items-start gap-3">
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${accent || 'bg-slate-100 text-slate-500'}`}>
      <Icon className="w-4 h-4" />
    </div>
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-sm font-semibold text-slate-800 mt-0.5">{value}</p>
    </div>
  </div>
);

const ViewConsultation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [consultation, setConsultation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const printRef = useRef();

  useEffect(() => {
    const fetchConsultation = async () => {
      try {
        const res = await api.get(`/consultations/${id}`);
        setConsultation(res.data);
      } catch {
        toast.error('Failed to load consultation');
        navigate('/consultations');
      } finally {
        setLoading(false);
      }
    };
    fetchConsultation();
  }, [id, navigate]);

  const handleDownloadPdf = async () => {
    if (!consultation) return;
    setGenerating(true);
    const toastId = toast.loading('Generating PDF...');
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `Consultation_${consultation.clientName.replace(/\s+/g, '_')}_${new Date(consultation.consultationDate).toLocaleDateString('en-IN').replace(/\//g, '-')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      await html2pdf().set(opt).from(printRef.current).save();
      toast.success('PDF downloaded!', { id: toastId });
    } catch {
      toast.error('PDF generation failed', { id: toastId });
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  if (!consultation) return null;

  const sc = statusConfig[consultation.status] || statusConfig['Completed'];
  const StatusIcon = sc.icon;

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium transition-colors text-sm">
          <MdArrowBack className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadPdf}
            disabled={generating}
            className="btn-primary"
            style={{
              background: generating ? 'rgba(16,185,129,0.5)' : 'linear-gradient(135deg,#10b981,#059669)',
              boxShadow: '0 2px 8px rgba(16,185,129,0.3)'
            }}
          >
            <MdDownload className="w-4 h-4" />
            {generating ? 'Generating...' : 'Download PDF'}
          </button>
          <Link to={`/consultations/edit/${id}`} className="btn-secondary">
            <MdEdit className="w-4 h-4" /> Edit
          </Link>
        </div>
      </div>

      {/* Client hero card */}
      <div className="card overflow-hidden">
        <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-lg">
              <span className="text-white text-xl font-bold">{consultation.clientName?.[0]?.toUpperCase()}</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{consultation.clientName}</h2>
              <div className="flex items-center gap-2 mt-1">
                <MdPhone className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-sm text-slate-500">{consultation.phone}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`badge ${categoryColors[consultation.category] || 'badge-slate'}`}>{consultation.category}</span>
            <span className={`badge ${sc.cls} flex items-center gap-1`}>
              <StatusIcon className="w-3 h-3" />{consultation.status}
            </span>
          </div>
        </div>

        {/* Details grid */}
        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            <InfoItem
              icon={MdCalendarToday}
              label="Date"
              value={new Date(consultation.consultationDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
              accent="bg-indigo-50 text-indigo-600"
            />
            <InfoItem
              icon={MdAccessTime}
              label="Duration"
              value={`${consultation.duration} minutes`}
              accent="bg-blue-50 text-blue-600"
            />
            <InfoItem
              icon={MdDevices}
              label="Mode"
              value={`${modeEmojis[consultation.mode] || ''} ${consultation.mode}`}
              accent="bg-violet-50 text-violet-600"
            />
            <InfoItem
              icon={MdCalendarToday}
              label="Added On"
              value={new Date(consultation.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              accent="bg-slate-100 text-slate-500"
            />
          </div>

          {/* Follow-up alert */}
          {consultation.followUpRequired && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
              <MdNotificationsActive className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-800">Follow-Up Required</p>
                {consultation.followUpDate && (
                  <p className="text-xs text-amber-600 mt-0.5">
                    Scheduled: {new Date(consultation.followUpDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Tags */}
          {consultation.tags?.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {consultation.tags.map(tag => (
                  <span key={tag} className="badge badge-slate"># {tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="mb-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Consultation Notes</p>
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 min-h-[120px] text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {consultation.notes || <span className="text-slate-400 italic">No notes provided.</span>}
            </div>
          </div>

          {/* Recording */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Recording</p>
            {consultation.recordingLink ? (
              <a
                href={consultation.recordingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-100 hover:bg-indigo-100 transition-colors group"
              >
                <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0">
                  <MdLink className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm">Open Recording</p>
                  <p className="text-xs text-indigo-500 truncate group-hover:underline">{consultation.recordingLink}</p>
                </div>
              </a>
            ) : (
              <div className="p-4 bg-slate-50 text-slate-400 rounded-xl border border-slate-100 text-sm italic">
                No recording link provided.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hidden PDF template */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <div ref={printRef} style={{ fontFamily: 'Arial, sans-serif', padding: '40px', width: '700px', color: '#1f2937', background: '#fff' }}>
          {/* PDF Header */}
          <div style={{ borderBottom: '3px solid #4f46e5', paddingBottom: '20px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 'bold', color: '#4f46e5' }}>Consultation Report</h1>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b7280' }}>Consultation Recording Manager</p>
            </div>
            <div style={{ textAlign: 'right', fontSize: '12px', color: '#9ca3af' }}>
              <p style={{ margin: 0 }}>Generated on</p>
              <p style={{ margin: 0, fontWeight: 'bold', color: '#374151' }}>
                {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Client Info Block */}
          <div style={{ background: '#f5f3ff', borderRadius: '12px', padding: '20px 24px', marginBottom: '20px', borderLeft: '4px solid #4f46e5' }}>
            <h2 style={{ margin: '0 0 12px', fontSize: '22px', fontWeight: 'bold', color: '#111827' }}>{consultation.clientName}</h2>
            <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
              {[
                ['Phone', consultation.phone],
                ['Date', new Date(consultation.consultationDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })],
                ['Duration', `${consultation.duration} minutes`],
                ['Category', consultation.category],
                ['Mode', consultation.mode],
                ['Status', consultation.status],
              ].map(([l, v]) => (
                <div key={l}>
                  <p style={{ margin: 0, fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{l}</p>
                  <p style={{ margin: '2px 0 0', fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>{v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Follow-up */}
          {consultation.followUpRequired && (
            <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '10px', padding: '14px 18px', marginBottom: '20px' }}>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#92400e' }}>
                Follow-Up Required
                {consultation.followUpDate
                  ? ` — ${new Date(consultation.followUpDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}`
                  : ''}
              </p>
            </div>
          )}

          {/* Tags */}
          {consultation.tags?.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Tags</h3>
              <p style={{ fontSize: '13px', color: '#374151' }}>{consultation.tags.join(' • ')}</p>
            </div>
          )}

          {/* Notes */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 10px', fontSize: '12px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Consultation Notes</h3>
            <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '18px', minHeight: '100px', fontSize: '14px', lineHeight: '1.7', color: '#374151', whiteSpace: 'pre-wrap' }}>
              {consultation.notes || 'No notes provided.'}
            </div>
          </div>

          {/* Recording */}
          {consultation.recordingLink && (
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '12px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Recording Link</h3>
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '12px 16px', fontSize: '13px', color: '#1d4ed8', wordBreak: 'break-all' }}>
                {consultation.recordingLink}
              </div>
            </div>
          )}

          {/* PDF Footer */}
          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px', marginTop: '24px', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#9ca3af' }}>
            <span>Consultation Recording Manager</span>
            <span>Confidential — For internal use only</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewConsultation;
