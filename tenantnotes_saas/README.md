# TenantNotes SaaS Application

## Overview

TenantNotes is a multi-tenant SaaS Notes Application that allows multiple tenants (companies) to securely manage their users and notes. The application enforces strict tenant isolation, role-based access control, and subscription-based feature gating.

## Multi-Tenancy Approach

This application uses a **shared schema with a tenant ID (slug) column** approach for multi-tenancy. All tenants share the same database and collections, but each record (users, notes) includes a `tenantSlug` field to isolate data per tenant. This ensures strict data isolation by filtering queries based on the tenant slug.

## Authentication and Authorization

- JWT-based authentication is implemented.
- Roles:
  - **Admin**: Can invite users and upgrade subscriptions.
  - **Member**: Can create, view, edit, and delete notes.
- Mandatory test accounts (all with password: `password`):
  - `admin@acme.test` (Admin, tenant: Acme)
  - `user@acme.test` (Member, tenant: Acme)
  - `admin@globex.test` (Admin, tenant: Globex)
  - `user@globex.test` (Member, tenant: Globex)

## Subscription Feature Gating

- **Free Plan**: Tenant limited to a maximum of 3 notes.
- **Pro Plan**: Unlimited notes.
- Upgrade endpoint: `POST /tenants/:slug/upgrade` (accessible only by Admin).
- After upgrade, the tenant’s note limit is lifted immediately.

## Backend API

The backend API is implemented using Node.js, Express, and MongoDB (via Mongoose). It provides endpoints for:

- User login (`POST /login`)
- Tenant subscription upgrade (`POST /tenants/:slug/upgrade`)
- Notes CRUD operations (`/notes` endpoints) with tenant isolation and role enforcement.

## Running the Backend

1. Ensure MongoDB is running locally on `mongodb://localhost:27017`.
2. Navigate to the `tenantnotes_saas/api` directory.
3. Install dependencies:
   ```
   npm install express cors jsonwebtoken bcryptjs mongoose
   ```
4. Start the server:
   ```
   node server.js
   ```
5. Seed initial tenants and users by sending a POST request to `/seed` endpoint (e.g., using Postman or curl):
   ```
   POST http://localhost:4000/seed
   ```

## Frontend

The frontend is a React application located in the `tenantnotes_saas/src` directory. It handles login, notes management, user management, subscription management, and dashboard views.

## Notes

- The backend enforces strict tenant isolation by filtering data based on the tenant slug embedded in the JWT token.
- Role-based access control is enforced on all protected endpoints.
- Subscription limits are enforced on note creation for free plan tenants.
