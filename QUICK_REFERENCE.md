# Quick Reference Card

## Setup in 2 Steps

```bash
# 1. Configure environment
cp .env.example .env.local
openssl rand -base64 32  # Copy output to NEXTAUTH_SECRET
# Edit .env.local with POSTGRES_URL

# 2. Run
pnpm install && pnpm dev
```

Visit: http://localhost:3000/login

---

## Code Examples

### Check Permissions (Server Component)
```typescript
import { checkPermission } from '@/app/lib/permissions';

export default async function Page() {
  const canView = await checkPermission('canViewUsers');
  if (!canView) return <div>Access denied</div>;
}
```

### Require Admin (Server Action)
```typescript
import { requireAdmin } from '@/app/lib/actions/permissions';

export async function deleteUser(id: string) {
  await requireAdmin(); // Throws if not admin
  // Delete user...
}
```

### Get Session (Client Component)
```typescript
'use client';
import { useSession } from 'next-auth/react';

export default function Component() {
  const { data: session } = useSession();
  return <div>{session?.user?.name}</div>;
}
```

---

## Key Files

| File | Purpose |
|------|---------|
| `app/providers.tsx` | SessionProvider wrapper |
| `app/lib/auth.ts` | NextAuth configuration |
| `auth.config.ts` | Authorization callbacks |
| `middleware.ts` | Route protection |
| `app/lib/permissions.ts` | Permission utilities |
| `app/ui/dashboard/nav-links.tsx` | Conditional navigation |

---

## Environment Variables

```env
NEXTAUTH_SECRET=<32-char-random-string>
NEXTAUTH_URL=http://localhost:3000  # dev
# NEXTAUTH_URL=https://yourdomain.com  # production

POSTGRES_URL=postgresql://user:pass@host:port/db?sslmode=require
```

---

## Permissions Matrix

| Feature | Admin | User |
|---------|-------|------|
| View/Manage Users | ✅ | ❌ |
| View/Manage Customers | ✅ | ✅ |
| View/Manage Subscriptions | ✅ | ✅ |
| View Products | ✅ | ✅ |
| Create/Edit Products | ✅ | ❌ |
| View Reports | ✅ | ❌ |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "<!DOCTYPE" error | Set NEXTAUTH_SECRET & NEXTAUTH_URL |
| useSession() error | Check SessionProvider in layout.tsx |
| Session null | Verify NEXTAUTH_URL matches browser URL |
| Database error | Check POSTGRES_URL format + SSL |

---

## Authentication Flow

```
User → Login Form
     ↓
Credentials Provider (auth.ts)
     ↓
Validate against Database
     ↓
Create JWT Token with Role
     ↓
Set Session Cookie
     ↓
Redirect to Dashboard
```

---

## Role-Based Access

```typescript
// Server Component
const canView = await checkPermission('canViewUsers');

// Server Action
await requireAdmin();  // Enforces admin role

// Client Component
if (session?.user?.role === 'admin') { ... }

// Middleware
Automatically redirects non-admin from /dashboard/users
```

---

## Database Setup

```sql
-- Test users
INSERT INTO users (id, name, email, password, role) VALUES
  ('1', 'Admin', 'admin@test.com', 'password123', 'admin'),
  ('2', 'User', 'user@test.com', 'password123', 'user');
```

---

## Commands

```bash
pnpm dev          # Start development
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Check code quality

bash check-auth-setup.sh  # Verify environment
```

---

## Documentation

- **QUICKSTART.md** - Quick setup guide
- **AUTH_SETUP.md** - Detailed auth configuration
- **NEXTAUTH_FIX.md** - Error troubleshooting
- **RBAC.md** - Role-based access control
- **.github/copilot-instructions.md** - AI coding help

---

**Status: ✅ Ready to Use**
