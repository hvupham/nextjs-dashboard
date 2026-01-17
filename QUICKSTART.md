# 🚀 Quick Start Guide

Get the dashboard running in 3 minutes.

## Prerequisites

- Node.js 18+ 
- PostgreSQL database
- `pnpm` package manager

## 1. Install Dependencies

```bash
pnpm install
```

## 2. Set Up Environment Variables

Create `.env.local` in the project root:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add:

```env
# PostgreSQL Database
POSTGRES_URL=postgresql://user:password@host:port/dbname?sslmode=require

# NextAuth Setup
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
NEXTAUTH_URL=http://localhost:3000
```

Generate a secure secret:
```bash
openssl rand -base64 32
```

## 3. Run the Application

```bash
pnpm dev
```

Open [http://localhost:3000/login](http://localhost:3000/login)

## 4. Test Login

Create a test user in your PostgreSQL database:

```sql
INSERT INTO users (id, name, email, password, role) VALUES
  ('1', 'Admin User', 'admin@test.com', 'password123', 'admin'),
  ('2', 'Sales User', 'sales@test.com', 'password123', 'user');
```

Login with:
- **Email:** `admin@test.com` or `sales@test.com`
- **Password:** `password123`

## Features

✅ **Role-Based Access Control**
- Admin: Full access (users, products, reports)
- User: Customer & subscription management only

✅ **Authentication**
- NextAuth with Credentials provider
- Session management with role info

✅ **Database**
- PostgreSQL with SSL
- Type-safe SQL queries with postgres client

✅ **UI Framework**
- Next.js 15 App Router
- Tailwind CSS + Heroicons
- Server components by default

## Directory Structure

```
app/
├── dashboard/          # Main application pages
├── lib/
│   ├── actions/        # Server actions (mutations)
│   ├── data/           # Data fetchers (queries)
│   └── permissions.ts  # RBAC utilities
├── ui/                 # Reusable components
└── providers.tsx       # SessionProvider setup

auth.config.ts          # NextAuth configuration
middleware.ts           # Route protection
```

## Common Tasks

### Add a New Page
1. Create file: `app/dashboard/feature/page.tsx`
2. Add to navigation: `app/ui/dashboard/nav-links.tsx`
3. Set permissions if needed

### Add a Form Field
1. Update Zod schema in `app/lib/actions/[resource].ts`
2. Add input in form component
3. Display field errors from state

### Check User Permissions
```typescript
import { checkPermission } from '@/app/lib/permissions';

const canView = await checkPermission('canViewUsers');
```

## Troubleshooting

### "Unexpected token '<', "<!DOCTYPE""
- ❌ Missing `NEXTAUTH_SECRET` or `NEXTAUTH_URL`
- ✅ Run: `openssl rand -base64 32`
- ✅ Add to `.env.local`
- ✅ Restart dev server

### Database Connection Error
- ✅ Check `POSTGRES_URL` format
- ✅ Ensure `sslmode=require`
- ✅ Verify database credentials

### useSession() returns null
- ✅ Verify `SessionProvider` in `app/layout.tsx`
- ✅ Check `NEXTAUTH_URL` matches browser URL
- ✅ Clear browser cookies

## Documentation

- [AUTH_SETUP.md](./AUTH_SETUP.md) - Detailed authentication setup
- [RBAC.md](./RBAC.md) - Role-based access control
- [RBAC_IMPLEMENTATION.md](./RBAC_IMPLEMENTATION.md) - Implementation details
- [.github/copilot-instructions.md](./.github/copilot-instructions.md) - AI coding instructions

## Next Steps

1. ✅ Set up environment variables
2. ✅ Run the development server
3. ✅ Create test users
4. ✅ Test role-based features
5. 📖 Read the documentation

## Support

For issues or questions, check:
1. `.env.local` is properly configured
2. PostgreSQL database is accessible
3. All dependencies are installed
4. Port 3000 is available

Happy coding! 🎉
