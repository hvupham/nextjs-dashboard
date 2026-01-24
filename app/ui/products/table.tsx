'use client';

import { ProductsTable } from '@/app/lib/definitions';
import { DeleteProduct, UpdateProduct } from '@/app/ui/products/buttons';
import Link from 'next/link';

interface SIMStatus {
  id: number;
  code: string;
  name_vi: string;
  emoji?: string;
}

export default function ProductsTableComponent({
  products,
  sortBy = 'name',
  sortOrder = 'ASC',
  simStatuses = [],
  currentStatusFilter,
}: {
  products: ProductsTable[];
  sortBy?: string;
  sortOrder?: string;
  simStatuses?: SIMStatus[];
  currentStatusFilter?: number;
}) {
  // Create a map for quick lookup by ID
  const statusMap = new Map(simStatuses.map(s => [s.id, `${s.emoji || ''} ${s.name_vi}`.trim()]));
  
  function getSIMStatusLabel(statusId: number | undefined): string {
    return statusMap.get(statusId || 0) || '-';
  }

  // Filter to show only SIM products
  // (All products are now SIM-only)
  const simProducts = products;

  if (simProducts.length === 0) {
    return (
      <div className="mt-6">
        <div className="mb-4 flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Lọc theo trạng thái:</label>
          <select 
            className="rounded-md border border-gray-300 py-2 px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => {
              const value = e.currentTarget.value;
              const url = new URL(window.location.href);
              if (value) {
                url.searchParams.set('statusFilter', value);
              } else {
                url.searchParams.delete('statusFilter');
              }
              window.location.href = url.toString();
            }}
            defaultValue={currentStatusFilter || ''}
          >
            <option value="">-- Tất cả trạng thái --</option>
            {simStatuses.map((status) => (
              <option key={status.id} value={status.id}>
                {status.emoji || ''} {status.name_vi}
              </option>
            ))}
          </select>
        </div>
        <div className="text-center text-gray-500 py-8">
          Không có sản phẩm SIM nào
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 flow-root">
      {/* Filter Bar */}
      <div className="mb-4 flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">Lọc theo trạng thái:</label>
        <select 
          className="rounded-md border border-gray-300 py-2 px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => {
            const value = e.currentTarget.value;
            const url = new URL(window.location.href);
            if (value) {
              url.searchParams.set('statusFilter', value);
            } else {
              url.searchParams.delete('statusFilter');
            }
            window.location.href = url.toString();
          }}
          defaultValue={currentStatusFilter || ''}
        >
          <option value="">-- Tất cả trạng thái --</option>
          {simStatuses.map((status) => (
            <option key={status.id} value={status.id}>
              {status.emoji || ''} {status.name_vi}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b-2 border-gray-300">
            <tr>
              <th className="px-3 py-3 text-left font-semibold text-gray-700">#</th>
              <th className="px-3 py-3 text-left font-semibold text-gray-700">MSN / IMSI</th>
              <th className="px-3 py-3 text-left font-semibold text-gray-700">Nhà mạng</th>
              <th className="px-3 py-3 text-left font-semibold text-gray-700">ICCID / Serial</th>
              <th className="px-3 py-3 text-left font-semibold text-gray-700">Dung lượng</th>
              <th className="px-3 py-3 text-left font-semibold text-gray-700">Trạng thái</th>
              <th className="px-3 py-3 text-left font-semibold text-gray-700 text-xs">Tháng này</th>
              <th className="px-3 py-3 text-left font-semibold text-gray-700 text-xs">Tháng trước</th>
              <th className="px-3 py-3 text-left font-semibold text-gray-700">Ngày xuất kho</th>
              <th className="px-3 py-3 text-left font-semibold text-gray-700">Ngày kích hoạt</th>
              <th className="px-3 py-3 text-right font-semibold text-gray-700">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {simProducts.map((product, index) => (
              <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                <td className="px-3 py-3 text-center font-medium text-gray-600">{index + 1}</td>
                <td className="px-3 py-3">
                  <Link 
                    href={`/dashboard/products/${product.id}`} 
                    className="text-blue-600 hover:underline font-mono text-sm"
                  >
                    {product.msn || '-'}
                  </Link>
                </td>
                <td className="px-3 py-3 font-medium">{product.carrier || '-'}</td>
                <td className="px-3 py-3 font-mono text-xs">{product.iccid || '-'}</td>
                <td className="px-3 py-3 font-semibold text-purple-600">{product.capacity || '-'}</td>
                <td className="px-3 py-3 text-sm">{getSIMStatusLabel(product.sim_status_id)}</td>
                <td className="px-3 py-3 text-sm text-gray-700">
                  {product.current_month_usage ? `${product.current_month_usage}[G]` : '-'}
                </td>
                <td className="px-3 py-3 text-sm text-gray-700">
                  {product.previous_month_usage ? `${product.previous_month_usage}[G]` : '-'}
                </td>
                <td className="px-3 py-3 text-sm">
                  {product.shipping_date ? new Date(product.shipping_date).toLocaleDateString('ja-JP') : '-'}
                </td>
                <td className="px-3 py-3 text-sm">
                  {product.activation_date ? new Date(product.activation_date).toLocaleDateString('ja-JP') : '-'}
                </td>
                <td className="px-3 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <UpdateProduct id={product.id} />
                    <DeleteProduct id={product.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
