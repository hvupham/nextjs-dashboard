#!/bin/bash

# NextAuth Environment Check Script

echo "🔍 Checking NextAuth Setup..."
echo ""

# Check .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local not found"
    echo "   Run: cp .env.example .env.local"
    exit 1
else
    echo "✅ .env.local exists"
fi

echo ""
echo "🔑 Checking Environment Variables:"
echo ""

# Check NEXTAUTH_SECRET
if grep -q "^NEXTAUTH_SECRET=" .env.local && [ ! -z "$(grep '^NEXTAUTH_SECRET=' .env.local | cut -d'=' -f2)" ]; then
    echo "✅ NEXTAUTH_SECRET is set"
else
    echo "❌ NEXTAUTH_SECRET not set or empty"
    echo "   Run: openssl rand -base64 32"
    echo "   Then add to .env.local"
fi

# Check NEXTAUTH_URL
if grep -q "^NEXTAUTH_URL=" .env.local && [ ! -z "$(grep '^NEXTAUTH_URL=' .env.local | cut -d'=' -f2)" ]; then
    echo "✅ NEXTAUTH_URL is set"
else
    echo "❌ NEXTAUTH_URL not set"
    echo "   For development, set to: http://localhost:3000"
fi

# Check POSTGRES_URL
if grep -q "^POSTGRES_URL=" .env.local && [ ! -z "$(grep '^POSTGRES_URL=' .env.local | cut -d'=' -f2)" ]; then
    echo "✅ POSTGRES_URL is set"
else
    echo "❌ POSTGRES_URL not set"
    echo "   Format: postgresql://user:password@host:port/dbname?sslmode=require"
fi

echo ""
echo "📋 Next Steps:"
echo "   1. Verify all environment variables are set"
echo "   2. Run: pnpm dev"
echo "   3. Visit: http://localhost:3000/login"
