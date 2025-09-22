const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;

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

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const db = await connectToDatabase();

    // Clear existing data
    await db.collection('tenants').deleteMany({});
    await db.collection('users').deleteMany({});
    await db.collection('notes').deleteMany({});
    await db.collection('invoices').deleteMany({});

    // Create tenants
    const tenants = [
      { slug: 'acme', name: 'Acme', subscription: 'free' },
      { slug: 'globex', name: 'Globex', subscription: 'free' },
    ];
    await db.collection('tenants').insertMany(tenants);

    // Create users
    const users = [
      { email: 'admin@acme.test', password: 'password', role: 'Admin', tenantSlug: 'acme' },
      { email: 'user@acme.test', password: 'password', role: 'Member', tenantSlug: 'acme' },
      { email: 'admin@globex.test', password: 'password', role: 'Admin', tenantSlug: 'globex' },
      { email: 'user@globex.test', password: 'password', role: 'Member', tenantSlug: 'globex' },
    ];

    for (const user of users) {
      const passwordHash = await bcrypt.hash(user.password, 10);
      await db.collection('users').insertOne({
        email: user.email,
        passwordHash,
        role: user.role,
        tenantSlug: user.tenantSlug,
      });
    }

    res.json({
      message: 'Seed data created successfully',
      tenants: tenants.length,
      users: users.length
    });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ message: 'Error seeding data' });
  }
};
