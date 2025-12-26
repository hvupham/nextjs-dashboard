import { notFound } from 'next/navigation';
import Link from 'next/link';
import { fetchSubscriptionById, fetchMonthlyPaymentsBySubscriptionId } from '@/app/lib/data';
import { formatCurrency, formatDateToLocal } from '@/app/lib/utils';
import { ArrowLeftIcon, CheckCircleIcon, ClockIcon, TruckIcon, UserIcon, PlusIcon } from '@heroicons/react/24/outline';

// Status Badge Component
const Badge = ({ status }: { status: string }) => {
  if (status === 'paid') {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 border border-green-300">
        <CheckCircleIcon className="w-4 h-4 text-green-600" />
        <span className="text-sm font-semibold text-green-700">Đã thanh toán</span>
      </div>
    );
  }
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100 border border-yellow-300">
      <ClockIcon className="w-4 h-4 text-yellow-600" />
      <span className="text-sm font-semibold text-yellow-700">Chưa thanh toán</span>
    </div>
  );
};

// Info Card Component
const InfoCard = ({ 
  icon: Icon, 
  title, 
  children 
}: { 
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; 
  title: string; 
  children: React.ReactNode 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

// Info Item Component
const InfoItem = ({ 
  label, 
  value, 
  badge 
}: { 
  label: string; 
  value: string; 
  badge?: boolean 
}) => {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="text-base font-medium text-gray-900">{value}</p>
    </div>
  );
};

export default async function SubscriptionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const subscription = await fetchSubscriptionById(id);
  const monthlyPayments = await fetchMonthlyPaymentsBySubscriptionId(id);
  console.log('subscription', monthlyPayments);

  if (!subscription) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/subscriptions"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors mb-6"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span className="text-sm font-medium">Quay lại</span>
        </Link>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Chi tiết đơn hàng</h1>
              <p className="text-sm text-gray-600">Mã: {subscription.id.substring(0, 8)}...</p>
            </div>
            <Badge status={subscription.status} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Khách hàng */}
        <InfoCard icon={UserIcon} title="Thông tin khách hàng">
          <InfoItem label="Tên khách" value={subscription.customer_name || '-'} />
          <InfoItem label="Email" value={subscription.customer_email || '-'} />
        </InfoCard>

        {/* Đơn hàng */}
        <InfoCard icon={PlusIcon} title="Thông tin đơn hàng">
          <InfoItem label="Ngày nhận SIM" value={formatDateToLocal(subscription.date)} />
          <InfoItem label="Cước" value={formatCurrency(subscription.amount)} />
          <InfoItem label="Gói" value={`${subscription.package_months} tháng`} />
        </InfoCard>

        {/* Sản phẩm */}
        <InfoCard icon={PlusIcon} title="Thông tin sản phẩm">
          <InfoItem label="Loại sản phẩm" value={subscription.product_type || '-'} />
          <InfoItem label="Loại dữ liệu" value={subscription.data_type || '-'} />
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Trạng thái SIM</p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-300">
              <span className={`text-sm font-semibold ${subscription.sim_status === 'xuat' ? 'text-green-700' : 'text-yellow-700'}`}>
                {subscription.sim_status === 'xuat' ? '✓ Đã xuất' : '⏳ Chưa xuất'}
              </span>
            </div>
          </div>
        </InfoCard>
      </div>

      {/* Giao hàng và nhân viên */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Giao hàng */}
        <InfoCard icon={TruckIcon} title="Thông tin giao hàng">
          <InfoItem label="Ngày xuất SIM" value={subscription.export_date ? formatDateToLocal(subscription.export_date) : '-'} />
          <InfoItem label="Mã vận chuyển" value={subscription.tracking_number || '-'} />
          <InfoItem label="Ghi chú" value={subscription.notes || '-'} />
        </InfoCard>

        {/* Nhân viên */}
        <InfoCard icon={UserIcon} title="Thông tin nhân viên">
          <InfoItem label="Nhân viên chốt" value={subscription.employee_name || '-'} />
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-700">Nhân viên này chịu trách nhiệm xuất hàng và giao dịch cho đơn hàng này.</p>
          </div>
        </InfoCard>
      </div>

      {/* Monthly Payments Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Thanh toán hàng tháng</h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <p className="text-sm font-medium text-gray-700">
              Tổng: {monthlyPayments.length} tháng | Đã thanh toán: {monthlyPayments.filter(p => p.payment_status === 'paid').length} tháng
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Tháng thanh toán</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Số tiền</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Ngày thanh toán</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {monthlyPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDateToLocal(payment.payment_month)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(payment.amount * 100)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {payment.payment_status === 'paid' ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                          <CheckCircleIcon className="w-3 h-3" />
                          Đã thanh toán
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">
                          <ClockIcon className="w-3 h-3" />
                          Chưa thanh toán
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {payment.paid_date ? formatDateToLocal(payment.paid_date) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
