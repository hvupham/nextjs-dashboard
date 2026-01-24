'use client';

import { createPayment, markPaymentAsPaid } from '@/app/lib/actions/payments';
import { PaymentsTable } from '@/app/lib/definitions';
import { useState } from 'react';

interface PaymentSectionProps {
  productId: string;
  productMsn: string;
  customerId?: string;
  customerName?: string;
  payments: PaymentsTable[];
}

export function PaymentSection({
  productId,
  productMsn,
  customerId,
  customerName,
  payments,
}: PaymentSectionProps) {
  const [isCreatingPayment, setIsCreatingPayment] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleMarkAsPaid = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      const paymentId = formData.get('payment_id') as string;
      const paymentDate = formData.get('payment_date') as string;
      
      await markPaymentAsPaid(paymentId, paymentDate);
      window.location.reload();
    } catch (error) {
      alert('Lỗi: ' + (error instanceof Error ? error.message : 'Không thể cập nhật'));
      setIsLoading(false);
    }
  };

  const handleCreatePayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!customerId) {
      alert('Vui lòng assign khách hàng trước');
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData(e.currentTarget);
      await createPayment(formData);
      window.location.reload();
    } catch (error) {
      alert('Lỗi: ' + (error instanceof Error ? error.message : 'Không thể tạo thanh toán'));
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-6 text-lg font-semibold text-gray-900">Lịch sử thanh toán</h2>

        {payments.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            Chưa có thanh toán nào cho SIM này
          </p>
        ) : (
          <div className="space-y-3">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  payment.status === 'paid'
                    ? 'bg-green-50 border-green-200'
                    : payment.status === 'overdue'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-yellow-50 border-yellow-200'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-900">
                      {new Date(payment.billing_month).toLocaleDateString('vi-VN', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      payment.status === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : payment.status === 'overdue'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {payment.status === 'paid' ? '✓ Đã thanh toán' : payment.status === 'overdue' ? '⚠ Quá hạn' : '⏳ Chờ thanh toán'}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    Số tiền: <span className="font-semibold text-gray-900">₫{payment.amount.toLocaleString('vi-VN')}</span>
                    {payment.payment_date && (
                      <>
                        {' • '}
                        Thanh toán: {new Date(payment.payment_date).toLocaleDateString('vi-VN')}
                      </>
                    )}
                  </div>
                  {payment.notes && (
                    <div className="mt-1 text-sm text-gray-600">
                      Ghi chú: {payment.notes}
                    </div>
                  )}
                </div>

                {payment.status === 'pending' && (
                  <form onSubmit={handleMarkAsPaid} className="ml-4 flex gap-2">
                    <input
                      type="hidden"
                      name="payment_id"
                      value={payment.id}
                    />
                    <input
                      type="date"
                      name="payment_date"
                      required
                      className="rounded border border-gray-300 px-2 py-1 text-sm"
                      defaultValue={new Date().toISOString().split('T')[0]}
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="rounded-lg bg-green-600 px-3 py-1 text-sm font-medium text-white hover:bg-green-700 transition disabled:opacity-50"
                    >
                      ✓ Xác nhận
                    </button>
                  </form>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Create New Payment */}
        {customerId && (
          <div className="mt-6 border-t border-gray-200 pt-6">
            <button
              onClick={() => setIsCreatingPayment(!isCreatingPayment)}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              {isCreatingPayment ? '✕ Đóng' : '+ Tạo thanh toán mới'}
            </button>

            {isCreatingPayment && (
              <form onSubmit={handleCreatePayment} className="mt-4 space-y-3">
                <input type="hidden" name="product_id" value={productId} />
                <input type="hidden" name="customer_id" value={customerId} />
                <input type="hidden" name="status" value="pending" />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tháng thanh toán
                  </label>
                  <input
                    type="date"
                    name="billing_month"
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số tiền
                  </label>
                  <div className="flex items-center gap-2">
                    <span>₫</span>
                    <input
                      type="number"
                      name="amount"
                      required
                      min="0"
                      step="0.01"
                      placeholder="0"
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {isLoading ? 'Đang tạo...' : 'Tạo thanh toán'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
