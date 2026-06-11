const Consultation = require('../models/Consultation');
const Activity = require('../models/Activity');

const getDashboardStats = async (req, res) => {
  try {
    const all = await Consultation.find();
    const uniqueClients = new Set(all.map(c => c.phone)).size;
    const totalHours = all.reduce((sum, c) => sum + c.duration, 0) / 60;
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonth = all.filter(c => {
      const d = new Date(c.consultationDate);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length;
    const now = new Date();
    const upcomingFollowUps = all.filter(c =>
      c.followUpRequired && c.followUpDate && new Date(c.followUpDate) >= now
    ).length;

    res.json({
      totalClients: uniqueClients,
      totalConsultations: all.length,
      thisMonth,
      totalHours: parseFloat(totalHours.toFixed(1)),
      upcomingFollowUps,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getClients = async (req, res) => {
  try {
    const clients = await Consultation.aggregate([
      {
        $group: {
          _id: '$phone',
          clientName: { $first: '$clientName' },
          phone: { $first: '$phone' },
          totalConsultations: { $sum: 1 },
          totalMinutes: { $sum: '$duration' },
          lastConsultation: { $max: '$consultationDate' },
        },
      },
      { $sort: { lastConsultation: -1 } },
    ]);

    res.json(
      clients.map(c => ({
        clientName: c.clientName,
        phone: c.phone,
        totalConsultations: c.totalConsultations,
        totalHours: parseFloat((c.totalMinutes / 60).toFixed(1)),
        lastConsultation: c.lastConsultation,
      }))
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getClientConsultations = async (req, res) => {
  try {
    const { phone } = req.params;
    const consultations = await Consultation.find({ phone }).sort({ consultationDate: -1 });
    res.json(consultations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find().sort({ consultationDate: -1 });
    res.json(consultations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getConsultationById = async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id);
    if (consultation) {
      res.json(consultation);
    } else {
      res.status(404).json({ message: 'Consultation not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createConsultation = async (req, res) => {
  try {
    const {
      clientName, phone, consultationDate, duration, category,
      mode, status, followUpRequired, followUpDate, tags,
      recordingLink, notes,
    } = req.body;

    const consultation = new Consultation({
      clientName,
      phone,
      consultationDate,
      duration,
      category,
      mode: mode || 'Phone Call',
      status: status || 'Completed',
      followUpRequired: followUpRequired || false,
      followUpDate: followUpDate || null,
      tags: tags || [],
      recordingLink: recordingLink || '',
      notes: notes || '',
    });

    const created = await consultation.save();
    await Activity.create({ message: `${clientName} consultation added`, type: 'created' });
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateConsultation = async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) return res.status(404).json({ message: 'Consultation not found' });

    const fields = [
      'clientName','phone','consultationDate','duration','category',
      'mode','status','followUpRequired','followUpDate','tags',
      'recordingLink','notes',
    ];
    fields.forEach(f => {
      if (req.body[f] !== undefined) consultation[f] = req.body[f];
    });

    const updated = await consultation.save();
    await Activity.create({ message: `${updated.clientName} consultation updated`, type: 'updated' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteConsultation = async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) return res.status(404).json({ message: 'Consultation not found' });

    const name = consultation.clientName;
    await Consultation.deleteOne({ _id: req.params.id });
    await Activity.create({ message: `${name} consultation deleted`, type: 'deleted' });
    res.json({ message: 'Consultation removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getActivities = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const activities = await Activity.find().sort({ createdAt: -1 }).limit(limit);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getClients,
  getClientConsultations,
  getConsultations,
  getConsultationById,
  createConsultation,
  updateConsultation,
  deleteConsultation,
  getActivities,
};
