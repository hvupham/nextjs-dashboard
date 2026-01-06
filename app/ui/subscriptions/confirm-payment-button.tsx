'use client';

import { confirmMonthlyPayment } from '@/app/lib/actions/subscriptions';
import { useState } from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

export function ConfirmPaymentButton({
  paymentId,
  subscriptionId,
  isPaid,
}: {
  paymentId: string;
  subscriptionId: string;
  isPaid: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(isPaid);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      const result = await confirmMonthlyPayment(paymentId, subscriptionId);
      if (result.success) {
        setStatus(!status);
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('Lỗi khi cập nhật trạng thái thanh toán');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
        status
          ? 'bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700'
          : 'bg-yellow-100 text-yellow-700 hover:bg-green-100 hover:text-green-700'
      }`}
    >
      {status ? (
        <>
          <CheckIcon className="w-3 h-3" />
          {isLoading ? 'Đang xử lý...' : 'Đã xác nhận'}
        </>
      ) : (
        <>
          <XMarkIcon className="w-3 h-3" />
          {isLoading ? 'Đang xử lý...' : 'Chưa xác nhận'}
        </>
      )}
    </button>
  );
}
