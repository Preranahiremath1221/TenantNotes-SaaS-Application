# TenantNotes SaaS - Vercel Deployment

A full-stack tenant notes SaaS application built with React, Vite, Express.js, and MongoDB, deployed on Vercel.

## 🚀 Deployment to Vercel

### Prerequisites

1. **MongoDB Atlas Account**: Set up a free MongoDB Atlas cluster
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)

### Environment Variables Setup

In your Vercel dashboard, add the following environment variables:

1. **MONGODB_URI**: Your MongoDB Atlas connection string
   ```
   mongodb+srv://username:password@cluster.mongodb.net/tenantnotes?retryWrites=true&w=majority
   ```

2. **JWT_SECRET**: A secure random string for JWT token signing
   ```
   your-super-secret-jwt-key-here
   ```

### Deployment Steps

1. **Connect Repository**
   - Connect your GitHub repository to Vercel
   - Vercel will automatically detect the configuration

2. **Configure Build Settings**
   - Build Command: `npm run vercel-build`
   - Output Directory: `tenantnotes_saas/build`
   - Install Command: `npm install`

3. **Set Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add the variables listed above

4. **Deploy**
   - Click "Deploy" and wait for the build to complete

### API Endpoints

After deployment, your API will be available at:
- `https://your-project.vercel.app/api/login`
- `https://your-project.vercel.app/api/notes`
- `https://your-project.vercel.app/api/notes/[id]`
- `https://your-project.vercel.app/api/tenants/[slug]/upgrade`
- `https://your-project.vercel.app/api/tenants/[slug]/billing-history`

### Database Setup

1. **Create MongoDB Atlas Cluster**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free cluster
   - Get your connection string

2. **Initialize Database**
   - After deployment, make a POST request to `/api/seed` to initialize sample data
   - Or manually create the collections: `users`, `tenants`, `notes`, `invoices`

### Test Accounts

After seeding, you can use these test accounts:
- **Admin**: admin@acme.test / password
- **Member**: user@acme.test / password
- **Admin**: admin@globex.test / password
- **Member**: user@globex.test / password

## 🛠️ Development

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start API server (for local development)
npm run server
```

### Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
├── api/                    # Vercel API routes
│   ├── login.js           # Authentication endpoint
│   ├── notes.js           # Notes CRUD operations
│   ├── notes/[id].js      # Individual note operations
│   └── tenants/[slug].js  # Tenant management
├── tenantnotes_saas/      # Frontend React application
│   ├── src/
│   ├── public/
│   └── package.json
├── vercel.json            # Vercel configuration
└── README.md
```

## 🔧 Configuration

### Vercel Configuration

The `vercel.json` file handles:
- Build settings for the React app
- API route routing
- Environment variable configuration

### Database Schema

**Users Collection:**
```javascript
{
  email: String,
  passwordHash: String,
  role: 'Admin' | 'Member',
  tenantSlug: String
}
```

**Tenants Collection:**
```javascript
{
  slug: String,
  name: String,
  subscription: 'free' | 'pro'
}
```

**Notes Collection:**
```javascript
{
  tenantSlug: String,
  userId: ObjectId,
  title: String,
  content: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🚨 Important Notes

1. **Environment Variables**: Never commit sensitive environment variables to your repository
2. **Database Security**: Ensure your MongoDB Atlas cluster has proper network access rules
3. **JWT Secret**: Use a strong, unique secret key for JWT token signing
4. **CORS**: The API routes are configured to allow all origins in production

## 📞 Support

For issues with deployment:
1. Check Vercel deployment logs
2. Verify environment variables are set correctly
3. Ensure MongoDB Atlas connection is working
4. Check API endpoint responses in browser dev tools
