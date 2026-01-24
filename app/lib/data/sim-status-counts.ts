import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export interface SimStatusCount {
  status_id: number;
  status_name: string;
  emoji?: string;
  count: number;
}

export async function fetchSIMStatusCounts(): Promise<SimStatusCount[]> {
  try {
    const result = await sql<SimStatusCount[]>`
      SELECT 
        s.id as status_id,
        s.name_vi as status_name,
        s.emoji,
        COUNT(p.id) as count
      FROM sim_statuses s
      LEFT JOIN products p ON s.id = p.sim_status_id
      GROUP BY s.id, s.name_vi, s.emoji
      ORDER BY s.id ASC
    `;
    return result;
  } catch (error) {
    console.error('Failed to fetch SIM status counts:', error);
    return [];
  }
}
