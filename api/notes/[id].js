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

    const { id } = req.query;

    switch (req.method) {
      case 'GET': {
        // Get note by id
        const note = await db.collection('notes').findOne({
          _id: new ObjectId(id),
          tenantSlug
        });
        if (!note) {
          return res.status(404).json({ message: 'Note not found' });
        }
        return res.json(note);
      }

      case 'PUT': {
        // Update note
        const note = await db.collection('notes').findOne({
          _id: new ObjectId(id),
          tenantSlug
        });
        if (!note) {
          return res.status(404).json({ message: 'Note not found' });
        }

        const { title, content } = req.body;
        const updateData = { updatedAt: new Date() };
        if (title) updateData.title = title;
        if (content) updateData.content = content;

        await db.collection('notes').updateOne(
          { _id: new ObjectId(id) },
          { $set: updateData }
        );

        const updatedNote = await db.collection('notes').findOne({ _id: new ObjectId(id) });
        return res.json(updatedNote);
      }

      case 'DELETE': {
        // Delete note
        const note = await db.collection('notes').findOne({
          _id: new ObjectId(id),
          tenantSlug
        });
        if (!note) {
          return res.status(404).json({ message: 'Note not found' });
        }

        await db.collection('notes').deleteOne({ _id: new ObjectId(id) });
        return res.json({ message: 'Note deleted' });
      }

      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Note API error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
