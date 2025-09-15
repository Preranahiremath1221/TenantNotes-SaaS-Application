require('dotenv').config({ path: './tenantnotes_saas/.env' });

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = '951a762a8925af4e094356c51bebc297710e8000ae560d9df481a3ef82fbaa64'; // Unified secret key for JWT signing and verification

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/tenantnotes', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Define Mongoose Schemas and Models

const tenantSchema = new mongoose.Schema({
  slug: { type: String, unique: true },
  name: String,
  subscription: { type: String, enum: ['free', 'pro'], default: 'free' },
});

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  passwordHash: String,
  role: { type: String, enum: ['Admin', 'Member'] },
  tenantSlug: String,
});

const noteSchema = new mongoose.Schema({
  tenantSlug: String,
  userId: mongoose.Schema.Types.ObjectId,
  title: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// New billing schema for invoices
const invoiceSchema = new mongoose.Schema({
  tenantSlug: String,
  date: { type: Date, default: Date.now },
  description: String,
  amount: Number,
  status: { type: String, enum: ['paid', 'failed', 'pending'], default: 'pending' },
  paymentMethod: String,
  downloadUrl: String,
  name: String,
});

const Tenant = mongoose.model('Tenant', tenantSchema);
const User = mongoose.model('User', userSchema);
const Note = mongoose.model('Note', noteSchema);
const Invoice = mongoose.model('Invoice', invoiceSchema);

// Middleware to authenticate JWT and set req.user
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Authorization header missing' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token missing' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    console.log('Authenticated user:', user);
    req.user = user;
    next();
  });
};

// Middleware to check Admin role
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Admin role required' });
  }
  next();
};

// Helper to check tenant subscription limits
const checkNoteLimit = async (tenantSlug) => {
  const tenant = await Tenant.findOne({ slug: tenantSlug });
  if (!tenant) return { allowed: false, message: 'Tenant not found' };
  if (tenant.subscription === 'pro') return { allowed: true };
  const noteCount = await Note.countDocuments({ tenantSlug });
  if (noteCount >= 3) return { allowed: false, message: 'Free plan limit reached (3 notes max)' };
  return { allowed: true };
};

// Routes

// Seed tenants and users (for testing/demo)
app.post('/seed', async (req, res) => {
  try {
    await Tenant.deleteMany({});
    await User.deleteMany({});
    await Note.deleteMany({});
    await Invoice.deleteMany({});

    const tenants = [
      { slug: 'acme', name: 'Acme', subscription: 'free' },
      { slug: 'globex', name: 'Globex', subscription: 'free' },
    ];
    await Tenant.insertMany(tenants);

    const users = [
      { email: 'admin@acme.test', password: 'password', role: 'Admin', tenantSlug: 'acme' },
      { email: 'user@acme.test', password: 'password', role: 'Member', tenantSlug: 'acme' },
      { email: 'admin@globex.test', password: 'password', role: 'Admin', tenantSlug: 'globex' },
      { email: 'user@globex.test', password: 'password', role: 'Member', tenantSlug: 'globex' },
    ];

    for (const u of users) {
      const passwordHash = await bcrypt.hash(u.password, 10);
      await User.create({
        email: u.email,
        passwordHash,
        role: u.role,
        tenantSlug: u.tenantSlug,
      });
    }

    res.json({ message: 'Seed data created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error seeding data' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if (!validPassword) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({
    id: user._id,
    email: user.email,
    role: user.role,
    tenantSlug: user.tenantSlug,
  }, JWT_SECRET, { expiresIn: '1h' });

  res.json({
    token,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      tenantSlug: user.tenantSlug,
    }
  });
});

// Upgrade subscription endpoint (Admin only)
app.post('/tenants/:slug/upgrade', authenticateJWT, requireAdmin, async (req, res) => {
  const { slug } = req.params;
  if (req.user.tenantSlug !== slug) {
    return res.status(403).json({ message: 'Cannot upgrade other tenant' });
  }
  try {
    const tenant = await Tenant.findOne({ slug });
    if (!tenant) return res.status(404).json({ message: 'Tenant not found' });
    tenant.subscription = 'pro';
    await tenant.save();

    // Create invoice for upgrade
    const invoice = new Invoice({
      tenantSlug: slug,
      description: 'Pro Plan - Monthly Subscription',
      amount: 29.99,
      status: 'paid',
      paymentMethod: '**** 4242', // In real app, get from paymentData
      downloadUrl: '#',
      name: req.body.cardholderName || 'Unknown',
    });
    await invoice.save();

    res.json({ message: 'Subscription upgraded to Pro' });
  } catch (err) {
    res.status(500).json({ message: 'Error upgrading subscription' });
  }
});

// Get billing history for tenant
app.get('/tenants/:slug/billing-history', authenticateJWT, requireAdmin, async (req, res) => {
  const { slug } = req.params;
  if (req.user.tenantSlug !== slug) {
    return res.status(403).json({ message: 'Cannot access other tenant billing history' });
  }
  try {
    const invoices = await Invoice.find({ tenantSlug: slug }).sort({ date: -1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching billing history' });
  }
});

// Notes CRUD endpoints with tenant isolation and role enforcement

// Create note
app.post('/notes', authenticateJWT, async (req, res) => {
  const { tenantSlug, role, id: userId } = req.user;
  if (!['Admin', 'Member'].includes(role)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  const { allowed, message } = await checkNoteLimit(tenantSlug);
  if (!allowed) return res.status(403).json({ message });

  const { title, content } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });

  const note = new Note({
    tenantSlug,
    userId,
    title,
    content,
  });
  await note.save();
  res.status(201).json(note);
});

// List notes
app.get('/notes', authenticateJWT, async (req, res) => {
  const { tenantSlug, role } = req.user;
  if (!['Admin', 'Member'].includes(role)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  const notes = await Note.find({ tenantSlug });
  res.json(notes);
});

// Get note by id
app.get('/notes/:id', authenticateJWT, async (req, res) => {
  const { tenantSlug, role } = req.user;
  if (!['Admin', 'Member'].includes(role)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  const note = await Note.findById(req.params.id);
  if (!note || note.tenantSlug !== tenantSlug) {
    return res.status(404).json({ message: 'Note not found' });
  }
  res.json(note);
});

// Update note
app.put('/notes/:id', authenticateJWT, async (req, res) => {
  const { tenantSlug, role } = req.user;
  if (!['Admin', 'Member'].includes(role)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  const note = await Note.findById(req.params.id);
  if (!note || note.tenantSlug !== tenantSlug) {
    return res.status(404).json({ message: 'Note not found' });
  }
  const { title, content } = req.body;
  if (title) note.title = title;
  if (content) note.content = content;
  note.updatedAt = new Date();
  await note.save();
  res.json(note);
});

// Delete note
app.delete('/notes/:id', authenticateJWT, async (req, res) => {
  const { tenantSlug, role } = req.user;
  if (!['Admin', 'Member'].includes(role)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  const note = await Note.findById(req.params.id);
  if (!note || note.tenantSlug !== tenantSlug) {
    return res.status(404).json({ message: 'Note not found' });
  }
  await note.deleteOne();
  res.json({ message: 'Note deleted' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
