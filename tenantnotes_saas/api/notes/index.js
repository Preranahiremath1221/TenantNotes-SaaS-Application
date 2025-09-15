const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tenantnotes';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

const tenantSchema = new mongoose.Schema({
  slug: { type: String, unique: true },
  name: String,
  subscription: { type: String, enum: ['free', 'pro'], default: 'free' },
});

const noteSchema = new mongoose.Schema({
  tenantSlug: String,
  userId: mongoose.Schema.Types.ObjectId,
  title: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Tenant = mongoose.model('Tenant', tenantSchema);
const Note = mongoose.model('Note', noteSchema);

// Middleware to authenticate JWT
const authenticateJWT = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) throw new Error('Authorization header missing');

  const token = authHeader.split(' ')[1];
  if (!token) throw new Error('Token missing');

  return jwt.verify(token, JWT_SECRET);
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

export default async function handler(req, res) {
  try {
    await mongoose.connect(MONGODB_URI);

    let user;
    try {
      user = authenticateJWT(req);
    } catch (error) {
      return res.status(401).json({ message: error.message });
    }

    if (req.method === 'GET') {
      // List notes
      if (!['Admin', 'Member'].includes(user.role)) {
        return res.status(403).json({ message: 'Access denied' });
      }
      const notes = await Note.find({ tenantSlug: user.tenantSlug });
      res.json(notes);
    } else if (req.method === 'POST') {
      // Create note
      if (!['Admin', 'Member'].includes(user.role)) {
        return res.status(403).json({ message: 'Access denied' });
      }
      const { allowed, message } = await checkNoteLimit(user.tenantSlug);
      if (!allowed) return res.status(403).json({ message });

      const { title, content } = req.body;
      if (!title) return res.status(400).json({ message: 'Title is required' });

      const note = new Note({
        tenantSlug: user.tenantSlug,
        userId: user.id,
        title,
        content,
      });
      await note.save();
      res.status(201).json(note);
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
