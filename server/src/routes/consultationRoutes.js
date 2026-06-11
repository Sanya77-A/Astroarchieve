const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  getDashboardStats,
  getClients,
  getClientConsultations,
  getConsultations,
  getConsultationById,
  createConsultation,
  updateConsultation,
  deleteConsultation,
  getActivities,
} = require('../controllers/consultationController');

router.use(protect);

router.get('/dashboard/stats', getDashboardStats);
router.get('/clients', getClients);
router.get('/clients/:phone/consultations', getClientConsultations);
router.get('/activities', getActivities);
router.route('/consultations').get(getConsultations).post(createConsultation);
router.route('/consultations/:id').get(getConsultationById).put(updateConsultation).delete(deleteConsultation);

module.exports = router;
