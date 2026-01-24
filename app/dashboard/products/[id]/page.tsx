import { auth } from '@/app/lib/auth';
import { fetchCustomers } from '@/app/lib/data';
import { fetchPaymentsByProduct } from '@/app/lib/data/payments';
import { fetchProductWithCustomer } from '@/app/lib/data/products-with-customer';
import { fetchSIMStatuses } from '@/app/lib/data/sim-statuses';
import { AssignCustomerForm } from '@/app/ui/products/assign-customer-form';
import { DeleteProduct, UpdateProduct } from '@/app/ui/products/buttons';
import { PaymentSection } from '@/app/ui/products/payment-section';

import { SIMCardDetail } from '@/app/ui/products/sim-card-detail';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

export default async function Page(props: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  // Verify user is authenticated
  if (!session?.user) {
    redirect('/login');
  }

  const params = await props.params;
  const { id } = params;

  let product;
  let customerInfo: { customer_name?: string; customer_email?: string } = {};
  try {
    const productWithCustomer = await fetchProductWithCustomer(id);
    if (!productWithCustomer) {
      notFound();
    }
    const { customer_name, customer_email, ...productData } = productWithCustomer;
    product = productData as any;
    customerInfo = { customer_name, customer_email };
  } catch (error) {
    notFound();
  }

  // Fetch SIM status if status_id exists
  let simStatus;
  if (product.sim_status_id) {
    const statuses = await fetchSIMStatuses();
    simStatus = statuses.find(s => s.id === product.sim_status_id);
  }

  // Fetch all customers for the form
  const customers = await fetchCustomers();

  // Fetch payments for this product
  const payments = await fetchPaymentsByProduct(id);

  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/products"
            className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
          >
            ← Quay lại danh sách
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Chi tiết SIM Card</h1>
          <p className="mt-1 text-lg text-gray-600">
            MSN: {product.msn || 'N/A'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <UpdateProduct id={product.id} />
          <DeleteProduct id={product.id} />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column - Product Detail */}
        <div className="lg:col-span-2">
          <SIMCardDetail product={product} simStatus={simStatus} />
        </div>

        {/* Right Column - Summary Card */}
        <div>
          <div className="sticky top-4 space-y-4">
            {/* Customer Info Card */}
            {customerInfo.customer_name ? (
              <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6">
                <h4 className="mb-4 text-sm font-semibold uppercase text-gray-600">Khách hàng hiện tại</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                    </svg>
                    <span className="font-semibold text-gray-900">{customerInfo.customer_name}</span>
                  </div>
                  {customerInfo.customer_email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <span>{customerInfo.customer_email}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
                <p className="text-sm text-gray-500">Chưa có khách hàng</p>
              </div>
            )}

            {/* Assign Customer Form */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h4 className="mb-4 text-sm font-semibold uppercase text-gray-600">Thay đổi khách hàng</h4>
              <AssignCustomerForm 
                productId={product.id}
                currentCustomerId={product.customer_id}
                customers={customers}
                currentCustomerName={customerInfo.customer_name}
              />
            </div>

            {/* Price Card */}
            <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
              <h4 className="mb-4 text-sm font-semibold uppercase text-gray-600">Giá</h4>
              <div className="text-3xl font-bold text-gray-900">
                ₫{product.monthly_price.toLocaleString('vi-VN')}
                <span className="text-base font-normal text-gray-600">/tháng</span>
              </div>
            </div>

            {/* Status Badge */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h4 className="mb-4 text-sm font-semibold uppercase text-gray-600">Trạng thái SIM</h4>
              {simStatus ? (
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-800">
                  <span>{simStatus.emoji || '📦'}</span>
                  <span>{simStatus.name_vi}</span>
                </div>
              ) : (
                <span className="text-gray-500">Chưa xác định</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Section */}
      <PaymentSection 
        productId={product.id}
        productMsn={product.msn || ''}
        customerId={product.customer_id}
        customerName={customerInfo.customer_name}
        payments={payments}
      />
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  );
}
