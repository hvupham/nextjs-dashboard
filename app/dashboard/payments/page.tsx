import { auth } from '@/app/lib/auth';
import { fetchPayments } from '@/app/lib/data/payments';
import { redirect } from 'next/navigation';

export default async function Page() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const payments = await fetchPayments();

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">Quản lý thanh toán</h1>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <a
          href="/dashboard/payments/create"
          className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500"
        >
          + Tạo thanh toán
        </a>
      </div>

      <div className="mt-6">
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">SIM (MSN)</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Khách hàng</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tháng</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Số tiền</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Trạng thái</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Ngày thanh toán</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    Chưa có thanh toán nào
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm">{payment.msn || '-'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{payment.customer_name}</p>
                        <p className="text-xs text-gray-500">{payment.customer_email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {new Date(payment.billing_month).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">
                      ₫{payment.amount.toLocaleString('vi-VN')}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        payment.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : payment.status === 'overdue'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {payment.status === 'paid' ? '✓ Đã thanh toán' : payment.status === 'overdue' ? '⚠ Quá hạn' : '⏳ Chờ thanh toán'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-600">
                      {payment.payment_date ? new Date(payment.payment_date).toLocaleDateString('vi-VN') : '-'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <a
                          href={`/dashboard/payments/${payment.id}/edit`}
                          className="rounded-md border p-2 hover:bg-gray-100 transition"
                        >
                          ✎
                        </a>
                        <button
                          className="rounded-md border p-2 hover:bg-gray-100 transition"
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
