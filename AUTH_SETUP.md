# Authentication Setup Guide

## Environment Variables

You must set these environment variables in `.env.local` before running the application:

### Required Variables

```env
# Database Connection (PostgreSQL with SSL)
POSTGRES_URL=postgresql://user:password@host:port/dbname?sslmode=require

# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

## Setup Steps

### 1. Generate NEXTAUTH_SECRET

Run this command to generate a secure secret key:

```bash
openssl rand -base64 32
```

Copy the output and paste it into `.env.local` as `NEXTAUTH_SECRET`.

### 2. Set NEXTAUTH_URL

For development:
```env
NEXTAUTH_URL=http://localhost:3000
```

For production:
```env
NEXTAUTH_URL=https://yourdomain.com
```

### 3. Set POSTGRES_URL

Format: `postgresql://[user]:[password]@[host]:[port]/[dbname]?sslmode=require`

Example:
```env
POSTGRES_URL=postgresql://admin:password123@db.example.com:5432/dashboard?sslmode=require
```

### 4. Create .env.local

Create a `.env.local` file in the project root (not tracked by git):

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in the actual values:

```env
POSTGRES_URL=postgresql://...
NEXTAUTH_SECRET=generated-secret-key
NEXTAUTH_URL=http://localhost:3000
```

### 5. Verify Setup

Start the development server:
```bash
pnpm dev
```

Test:
1. Navigate to `http://localhost:3000/login`
2. You should see the login form (not JSON error)
3. Try logging in with a test user

## Common Errors & Solutions

### Error: "Unexpected token '<', "<!DOCTYPE ""

**Cause**: `NEXTAUTH_URL` or `NEXTAUTH_SECRET` not set

**Solution**:
1. Check that `.env.local` exists in the project root
2. Verify `NEXTAUTH_URL` is set to your application URL
3. Verify `NEXTAUTH_SECRET` is set (run `openssl rand -base64 32`)
4. Restart the dev server: `pnpm dev`

### Error: "Database Error: Failed to fetch user"

**Cause**: `POSTGRES_URL` not set or invalid

**Solution**:
1. Verify `POSTGRES_URL` format: `postgresql://user:password@host:port/db?sslmode=require`
2. Check database connection is accessible
3. Verify SSL is enabled (`?sslmode=require`)

### useSession() returns null in browser

**Cause**: Session not initialized or environment variables not loaded

**Solution**:
1. Verify `SessionProvider` is wrapped in `app/layout.tsx`
2. Check `NEXTAUTH_URL` matches your browser URL
3. Check browser's Application tab for `authjs.session-token` cookie

## Testing Login

Create a test user in the database:

```sql
INSERT INTO users (id, name, email, password, role) VALUES
  ('1', 'Admin User', 'admin@test.com', 'hashed_password', 'admin'),
  ('2', 'Sales User', 'sales@test.com', 'hashed_password', 'user');
```

Then login with:
- Email: `admin@test.com` or `sales@test.com`
- Password: Your test password (must be ≥ 6 characters)

## Next Steps

After successful setup:
1. Test role-based access control
2. Verify navigation links show/hide based on role
3. Test admin-only routes redirect correctly
4. Run `pnpm build` to verify production build works
