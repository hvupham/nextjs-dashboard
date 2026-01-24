import { fetchSIMStatusCounts } from '@/app/lib/data/sim-status-counts';
import Link from 'next/link';

export default async function SimStatusCounts() {
  const statusCounts = await fetchSIMStatusCounts();

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Trạng thái SIM</h2>
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Trạng thái</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Số lượng</th>
            </tr>
          </thead>
          <tbody>
            {statusCounts.map((status) => (
              <tr key={status.status_id} className="border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer">
                <td className="px-4 py-3">
                  <Link 
                    href={`/dashboard/products?statusFilter=${status.status_id}`}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <span>{status.emoji || '📦'}</span>
                    <span>{status.status_name}</span>
                  </Link>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link 
                    href={`/dashboard/products?statusFilter=${status.status_id}`}
                    className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition"
                  >
                    {status.count}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
