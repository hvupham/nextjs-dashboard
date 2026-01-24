import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export interface SIMStatus {
  id: number;
  code: string;
  name_vi: string;
  name_ja?: string;
  emoji?: string;
  description?: string;
  color?: string;
}

let simStatusesCache: SIMStatus[] | null = null;

export async function fetchSIMStatuses(): Promise<SIMStatus[]> {
  try {
    // Return cached data if available
    if (simStatusesCache) {
      return simStatusesCache;
    }

    const data = await sql<SIMStatus[]>`
      SELECT id, code, name_vi, name_ja, emoji, description, color
      FROM sim_statuses
      ORDER BY id ASC
    `;

    simStatusesCache = data;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    // Return empty array as fallback
    return [];
  }
}

export async function getSIMStatusByCode(code: string): Promise<SIMStatus | undefined> {
  const statuses = await fetchSIMStatuses();
  return statuses.find(s => s.code === code);
}

export function formatSIMStatus(status: SIMStatus): string {
  return `${status.emoji || ''} ${status.name_vi}`.trim();
}
