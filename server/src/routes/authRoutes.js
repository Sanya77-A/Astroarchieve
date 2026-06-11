const express = require('express');
const router = express.Router();
const { loginAdmin, registerAdmin } = require('../controllers/authController');

router.post('/login', loginAdmin);
router.post('/register', registerAdmin);

// Catch-all to prevent unmatched auth routes from falling through to protected /api routes
router.use((req, res) => {
  res.status(404).json({ message: 'Auth endpoint not found' });
});

module.exports = router;
