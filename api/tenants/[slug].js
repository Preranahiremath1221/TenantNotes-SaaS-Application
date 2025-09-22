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

function requireAdmin(req, res, user) {
  if (user.role !== 'Admin') {
    res.status(403).json({ message: 'Admin role required' });
    return false;
  }
  return true;
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

    const { slug } = req.query;
    if (user.tenantSlug !== slug) {
      return res.status(403).json({ message: 'Cannot access other tenant' });
    }

    switch (req.method) {
      case 'POST': {
        // Upgrade subscription
        if (!requireAdmin(req, res, user)) return;

        const tenant = await db.collection('tenants').findOne({ slug });
        if (!tenant) {
          return res.status(404).json({ message: 'Tenant not found' });
        }

        await db.collection('tenants').updateOne(
          { slug },
          { $set: { subscription: 'pro' } }
        );

        // Create invoice for upgrade
        const invoice = {
          tenantSlug: slug,
          date: new Date(),
          description: 'Pro Plan - Monthly Subscription',
          amount: 29.99,
          status: 'paid',
          paymentMethod: '**** 4242',
          downloadUrl: '#',
          name: req.body.cardholderName || 'Unknown',
        };

        await db.collection('invoices').insertOne(invoice);
        return res.json({ message: 'Subscription upgraded to Pro' });
      }

      case 'GET': {
        // Get billing history
        if (!requireAdmin(req, res, user)) return;

        const invoices = await db.collection('invoices')
          .find({ tenantSlug: slug })
          .sort({ date: -1 })
          .toArray();
        return res.json(invoices);
      }

      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Tenants API error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
