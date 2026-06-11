const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const consultationRoutes = require('./routes/consultationRoutes');
const authRoutes = require('./routes/authRoutes');
const Admin = require('./models/Admin');
const Consultation = require('./models/Consultation');
const Activity = require('./models/Activity');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', consultationRoutes);

const seedDatabase = async () => {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      await Admin.create({ email: 'admin@crm.com', password: 'admin123' });
      console.log('Default admin created.');
    }

    const count = await Consultation.countDocuments();
    if (count === 0) {
      console.log('Seeding demo data...');
      const today = new Date();
      const demoData = [
        {
          clientName: 'Rahul Sharma', phone: '9876543210',
          consultationDate: new Date(today.getTime() - 1 * 86400000),
          duration: 60, category: 'Career', mode: 'Zoom',
          status: 'Completed', followUpRequired: true,
          followUpDate: new Date(today.getTime() + 7 * 86400000),
          tags: ['career-switch', 'IT', 'urgent'],
          recordingLink: 'https://zoom.us/rec/example1',
          notes: 'Discussed career switch to IT. Client is interested in moving from finance to tech. Recommended upskilling in Python and data analysis.',
        },
        {
          clientName: 'Priya Mehta', phone: '9876543211',
          consultationDate: new Date(today.getTime() - 3 * 86400000),
          duration: 45, category: 'Marriage', mode: 'Google Meet',
          status: 'Follow-Up Required', followUpRequired: true,
          followUpDate: new Date(today.getTime() + 3 * 86400000),
          tags: ['kundli', 'compatibility'],
          recordingLink: 'https://meet.google.com/rec/example2',
          notes: 'Matchmaking consultation. Kundli compatibility analysis done. Follow-up needed for final decision.',
        },
        {
          clientName: 'Aman Gupta', phone: '9876543212',
          consultationDate: new Date(today.getTime() - 5 * 86400000),
          duration: 90, category: 'Business', mode: 'In-Person',
          status: 'Completed', followUpRequired: false,
          tags: ['startup', 'funding', 'strategy'],
          recordingLink: '',
          notes: 'Startup funding strategy discussion. Advised on Series A preparation. Client has strong traction.',
        },
        {
          clientName: 'Neha Verma', phone: '9876543213',
          consultationDate: new Date(today.getTime() - 8 * 86400000),
          duration: 30, category: 'Health', mode: 'WhatsApp Call',
          status: 'Completed', followUpRequired: false,
          tags: ['diet', 'lifestyle'],
          recordingLink: 'https://drive.google.com/example3',
          notes: 'Diet and lifestyle consultation. Provided customized meal plan.',
        },
        {
          clientName: 'Vikram Patel', phone: '9876543214',
          consultationDate: new Date(today.getTime() - 10 * 86400000),
          duration: 60, category: 'Finance', mode: 'Phone Call',
          status: 'Completed', followUpRequired: false,
          tags: ['investment', 'portfolio'],
          recordingLink: '',
          notes: 'Investment portfolio review. Suggested diversification into index funds.',
        },
        {
          clientName: 'Rahul Sharma', phone: '9876543210',
          consultationDate: new Date(today.getTime() - 15 * 86400000),
          duration: 30, category: 'Career', mode: 'Phone Call',
          status: 'Completed', followUpRequired: false,
          tags: ['resume', 'interview-prep'],
          recordingLink: '',
          notes: 'Resume review and interview preparation session.',
        },
        {
          clientName: 'Sunita Rao', phone: '9876543215',
          consultationDate: new Date(today.getTime() - 2 * 86400000),
          duration: 45, category: 'Education', mode: 'Zoom',
          status: 'Pending', followUpRequired: false,
          tags: ['study-abroad', 'MBA'],
          recordingLink: '',
          notes: 'MBA abroad consultation. Discussed target universities and GMAT preparation.',
        },
      ];
      await Consultation.insertMany(demoData);
      await Activity.create({ message: 'Rahul Sharma consultation added', type: 'created' });
      await Activity.create({ message: 'Priya Mehta consultation added', type: 'created' });
      await Activity.create({ message: 'Aman Gupta consultation added', type: 'created' });
      console.log('Demo data seeded successfully.');
    }
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

mongoose.connection.once('open', () => {
  seedDatabase();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
