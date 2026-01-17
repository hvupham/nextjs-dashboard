import { handlers } from '@/app/lib/auth';

console.log('API Route: handlers imported', handlers ? 'YES' : 'NO');

export const { GET, POST } = handlers;