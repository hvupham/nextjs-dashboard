'use client';

import { createPayment, updatePayment } from '@/app/lib/actions/payments';
import { Payment } from '@/app/lib/definitions';
import Link from 'next/link';
import { useState } from 'react';

interface PaymentFormProps {
  payment?: Payment & { customer_name?: string; msn?: string };
  products: any[];
  customers: any[];
  isEdit?: boolean;
}

export function PaymentForm({ payment, products, customers, isEdit = false }: PaymentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData(e.currentTarget);
      
      if (isEdit && payment?.id) {
        await updatePayment(payment.id, formData);
      } else {
        await createPayment(formData);
      }

      window.location.href = '/dashboard/payments';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-6 text-lg font-semibold text-gray-900">
            {isEdit ? 'Chỉnh sửa thanh toán' : 'Tạo thanh toán mới'}
          </h2>

          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Product Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SIM Card <span className="text-red-600">*</span>
              </label>
              <select
                name="product_id"
                required
                defaultValue={payment?.product_id || ''}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Chọn SIM --</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.msn} - {product.carrier}
                  </option>
                ))}
              </select>
            </div>

            {/* Customer Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Khách hàng <span className="text-red-600">*</span>
              </label>
              <select
                name="customer_id"
                required
                defaultValue={payment?.customer_id || ''}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Chọn khách hàng --</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} ({customer.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Billing Month */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tháng thanh toán <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                name="billing_month"
                required
                defaultValue={payment?.billing_month || ''}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số tiền <span className="text-red-600">*</span>
              </label>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">₫</span>
                <input
                  type="number"
                  name="amount"
                  required
                  min="0"
                  step="0.01"
                  defaultValue={payment?.amount || ''}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái <span className="text-red-600">*</span>
              </label>
              <select
                name="status"
                required
                defaultValue={payment?.status || 'pending'}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">⏳ Chờ thanh toán</option>
                <option value="paid">✓ Đã thanh toán</option>
                <option value="overdue">⚠ Quá hạn</option>
              </select>
            </div>

            {/* Payment Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày thanh toán
              </label>
              <input
                type="date"
                name="payment_date"
                defaultValue={payment?.payment_date ? new Date(payment.payment_date).toISOString().split('T')[0] : ''}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ghi chú
              </label>
              <textarea
                name="notes"
                defaultValue={payment?.notes || ''}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Thêm ghi chú..."
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="mt-8 flex gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {isLoading ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Tạo mới'}
            </button>
            <Link
              href="/dashboard/payments"
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Huỷ
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
