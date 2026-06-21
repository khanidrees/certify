const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

// Helper to load env files manually since we don't assume dotenv is installed globally
function loadEnvFile(filePath) {
  const absolutePath = path.resolve(filePath);
  if (fs.existsSync(absolutePath)) {
    console.log(`Loading env from ${filePath}`);
    const content = fs.readFileSync(absolutePath, 'utf-8');
    content.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        // Remove quotes if present
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = value.trim();
        }
      }
    });
  }
}

// Try to load env files in order of priority
loadEnvFile('.env.stress.local');
loadEnvFile('.env.local');
loadEnvFile('.env.production');
loadEnvFile('.env');

const mongoUri = process.env.STRESS_MONGODB_URI || process.env.MONGODB_URI;

if (!mongoUri) {
  console.error('ERROR: STRESS_MONGODB_URI or MONGODB_URI is not set in environment or env files.');
  console.log('Please define STRESS_MONGODB_URI in .env.stress.local or export it in your shell.');
  process.exit(1);
}

// Simple schema definition mimicking src/models/User.ts
const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String },
    organizationName: { type: String },
    learnerName: { type: String },
    role: {
      type: String,
      enum: ['admin', 'organization', 'learner'],
      required: true,
    },
    isApproved: { type: Boolean, default: false },
    googleId: { type: String, sparse: true },
    authProvider: { type: String, enum: ['google'] },
    avatar: { type: String },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model('User', UserSchema);

const usersToSeed = [
  {
    username: process.env.ADMIN_EMAIL || 'admin@stress.test',
    password: process.env.ADMIN_PASSWORD || 'Admin@StressTest1',
    role: 'admin',
    isApproved: true,
  },
  {
    username: process.env.ORG_EMAIL || 'org@stress.test',
    password: process.env.ORG_PASSWORD || 'Org@StressTest1',
    role: 'organization',
    organizationName: 'Stress Test Org',
    isApproved: true,
  },
  {
    username: 'learner@stress.test',
    password: 'Learner@StressTest1',
    role: 'learner',
    learnerName: 'Stress Test Learner',
    isApproved: true,
  }
];

async function seed() {
  console.log(`Connecting to MongoDB at: ${mongoUri.replace(/:([^@:]+)@/, ':****@')}`);
  await mongoose.connect(mongoUri);
  console.log('Connected successfully.');

  for (const userData of usersToSeed) {
    console.log(`Processing user: ${userData.username} (${userData.role})...`);
    
    // Delete existing user if any
    await User.deleteOne({ username: userData.username });
    
    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    
    const newUser = new User({
      ...userData,
      password: hashedPassword,
    });
    
    await newUser.save();
    console.log(`Successfully seeded ${userData.username}`);
  }

  console.log('Seeding complete. Closing database connection...');
  await mongoose.connection.close();
  console.log('Database connection closed.');
}

seed().catch(err => {
  console.error('Error seeding database:', err);
  process.exit(1);
});
