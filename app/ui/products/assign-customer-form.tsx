'use client';

import { updateProductCustomer } from '@/app/lib/actions/products';
import { Customer } from '@/app/lib/definitions';
import { useState } from 'react';

interface AssignCustomerFormProps {
  productId: string;
  currentCustomerId?: string;
  customers: Customer[];
  currentCustomerName?: string;
}

export function AssignCustomerForm({
  productId,
  currentCustomerId,
  customers,
  currentCustomerName,
}: AssignCustomerFormProps) {
  const [selectedCustomerId, setSelectedCustomerId] = useState(currentCustomerId || '');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      await updateProductCustomer(productId, selectedCustomerId || null);
      setMessage('✅ Đã cập nhật khách hàng thành công');
      setTimeout(() => {
        setMessage('');
        window.location.reload();
      }, 1500);
    } catch (error) {
      setMessage('❌ Lỗi cập nhật khách hàng');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Chọn khách hàng
        </label>
        <select
          value={selectedCustomerId}
          onChange={(e) => setSelectedCustomerId(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Không có khách hàng --</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name} ({customer.email})
            </option>
          ))}
        </select>
      </div>

      {message && (
        <div className={`rounded-lg p-3 text-sm ${
          message.startsWith('✅') 
            ? 'bg-green-50 text-green-700' 
            : 'bg-red-50 text-red-700'
        }`}>
          {message}
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isLoading || selectedCustomerId === currentCustomerId}
          className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </div>
    </form>
  );
}
