import * as fs from 'fs';
import * as path from 'path';
import postgres from 'postgres';

// Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach((line) => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      process.env[match[1].trim()] = match[2].trim();
    }
  });
}

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function createSIMStatusesTable() {
  try {
    console.log('Creating sim_statuses table...');

    // Create sim_statuses table
    await sql`
      CREATE TABLE IF NOT EXISTS sim_statuses (
        id SERIAL PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        name_vi VARCHAR(255) NOT NULL,
        name_ja VARCHAR(255),
        emoji VARCHAR(10),
        description TEXT,
        color VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Insert the 5 statuses
    await sql`
      INSERT INTO sim_statuses (code, name_vi, name_ja, emoji, color, description)
      VALUES
        ('active', 'Hoạt động', 'アクティブ', '🟢', 'green', 'SIM đang hoạt động bình thường'),
        ('not-activated', 'Chưa kích hoạt', '未アクティベート', '🔵', 'blue', 'SIM chưa được kích hoạt'),
        ('resetting', 'Đang làm lại', 'リセット中', '🔄', 'yellow', 'SIM đang trong quá trình làm lại'),
        ('in-stock', 'Tồn kho', '在庫中', '📦', 'purple', 'SIM còn tồn kho chưa được sử dụng'),
        ('suspended', 'Tạm dừng', '一時停止', '🔴', 'red', 'SIM bị tạm dừng hoặc khóa')
      ON CONFLICT (code) DO NOTHING;
    `;

    console.log('✅ Successfully created sim_statuses table with 5 statuses');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

createSIMStatusesTable();
