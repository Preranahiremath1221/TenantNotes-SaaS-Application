const jwt = require('jsonwebtoken');
const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET || '951a762a8925af4e094356c51bebc297710e8000ae560d9df481a3ef82fbaa64';

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  cachedDb = client.db('tenantnotes');
  return cachedDb;
}

function authenticateJWT(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ message: 'Authorization header missing' });
    return null;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'Token missing' });
    return null;
  }

  try {
    const user = jwt.verify(token, JWT_SECRET);
    return user;
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
    return null;
  }
}

async function checkNoteLimit(db, tenantSlug) {
  const tenant = await db.collection('tenants').findOne({ slug: tenantSlug });
  if (!tenant) return { allowed: false, message: 'Tenant not found' };
  if (tenant.subscription === 'pro') return { allowed: true };
  const noteCount = await db.collection('notes').countDocuments({ tenantSlug });
  if (noteCount >= 3) return { allowed: false, message: 'Free plan limit reached (3 notes max)' };
  return { allowed: true };
}

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const db = await connectToDatabase();
    const user = authenticateJWT(req, res);

    if (!user) return; // authenticateJWT already sent error response

    const { tenantSlug, role } = user;
    if (!['Admin', 'Member'].includes(role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    switch (req.method) {
      case 'GET': {
        // List notes
        const notes = await db.collection('notes').find({ tenantSlug }).toArray();
        return res.json(notes);
      }

      case 'POST': {
        // Create note
        const { allowed, message } = await checkNoteLimit(db, tenantSlug);
        if (!allowed) return res.status(403).json({ message });

        const { title, content } = req.body;
        if (!title) return res.status(400).json({ message: 'Title is required' });

        const note = {
          tenantSlug,
          userId: user.id,
          title,
          content,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const result = await db.collection('notes').insertOne(note);
        note._id = result.insertedId;
        return res.status(201).json(note);
      }

      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Notes API error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
