import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MdArrowBack, MdSave, MdPerson, MdPhone, MdDateRange, MdAccessTime, MdCategory, MdLink, MdNotes, MdLabel } from 'react-icons/md';
import toast from 'react-hot-toast';
import api from '../services/api';

const CATEGORIES = ['Career','Marriage','Health','Business','Education','Finance','General'];
const MODES = ['Phone Call','WhatsApp Call','Zoom','Google Meet','In-Person'];
const STATUSES = ['Completed','Pending','Follow-Up Required'];

const FormSection = ({ title, children }) => (
  <div className="space-y-4">
    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">{title}</h3>
    {children}
  </div>
);

const Field = ({ label, required, children }) => (
  <div>
    <label className="form-label">{label}{required && <span className="text-rose-500 ml-0.5">*</span>}</label>
    {children}
  </div>
);

const AddConsultation = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    clientName: '', phone: '', consultationDate: '', duration: '',
    category: 'General', mode: 'Phone Call', status: 'Completed',
    followUpRequired: false, followUpDate: '',
    recordingLink: '', tags: '', notes: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        followUpDate: formData.followUpRequired && formData.followUpDate ? formData.followUpDate : null,
      };
      await api.post('/consultations', payload);
      toast.success('Consultation added successfully!');
      navigate('/consultations');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add consultation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-white transition-colors">
          <MdArrowBack className="w-5 h-5" />
        </button>
        <div>
          <h1 className="page-title">Add Consultation</h1>
          <p className="text-muted">Create a new consultation record</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card p-6 space-y-6">
          {/* Client Info */}
          <FormSection title="Client Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Client Name" required>
                <input required type="text" name="clientName" value={formData.clientName} onChange={handleChange}
                  className="form-input" placeholder="e.g. Rahul Sharma" />
              </Field>
              <Field label="Phone Number" required>
                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange}
                  pattern="[0-9+\s\-]{10,15}" className="form-input" placeholder="e.g. 9876543210" />
              </Field>
            </div>
          </FormSection>

          {/* Consultation Details */}
          <FormSection title="Consultation Details">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Field label="Date" required>
                <input required type="date" name="consultationDate" value={formData.consultationDate} onChange={handleChange}
                  className="form-input" />
              </Field>
              <Field label="Duration (minutes)" required>
                <input required type="number" min="1" name="duration" value={formData.duration} onChange={handleChange}
                  className="form-input" placeholder="e.g. 60" />
              </Field>
              <Field label="Category" required>
                <select required name="category" value={formData.category} onChange={handleChange} className="form-input">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Mode" required>
                <select required name="mode" value={formData.mode} onChange={handleChange} className="form-input">
                  {MODES.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </Field>
              <Field label="Status" required>
                <select required name="status" value={formData.status} onChange={handleChange} className="form-input">
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Recording Link">
                <input type="url" name="recordingLink" value={formData.recordingLink} onChange={handleChange}
                  className="form-input" placeholder="https://zoom.us/rec/..." />
              </Field>
            </div>
          </FormSection>

          {/* Follow-Up */}
          <FormSection title="Follow-Up">
            <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
              <input type="checkbox" id="followUpRequired" name="followUpRequired" checked={formData.followUpRequired}
                onChange={handleChange} className="w-4 h-4 accent-amber-500 cursor-pointer" />
              <label htmlFor="followUpRequired" className="text-sm font-semibold text-amber-800 cursor-pointer">
                Follow-up required for this consultation
              </label>
            </div>
            {formData.followUpRequired && (
              <Field label="Follow-Up Date">
                <input type="date" name="followUpDate" value={formData.followUpDate} onChange={handleChange}
                  className="form-input max-w-xs" />
              </Field>
            )}
          </FormSection>

          {/* Additional */}
          <FormSection title="Additional Information">
            <Field label="Tags (comma separated)">
              <input type="text" name="tags" value={formData.tags} onChange={handleChange}
                className="form-input" placeholder="e.g. career-switch, urgent, astrology" />
            </Field>
            <Field label="Notes">
              <textarea name="notes" value={formData.notes} onChange={handleChange} rows={4}
                className="form-input resize-none"
                placeholder="Key discussion points, observations, action items..."></textarea>
            </Field>
          </FormSection>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div> Saving...</>
              ) : (
                <><MdSave className="w-4 h-4" /> Save Consultation</>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddConsultation;
