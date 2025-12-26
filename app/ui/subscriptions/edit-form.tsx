'use client';

import { CustomerField, subscriptionForm } from '@/app/lib/definitions';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { State, updatesubscription } from '@/app/lib/actions';
import { useActionState } from 'react';

export default function EditsubscriptionForm({
  subscription,
  customers,
}: {
  subscription: subscriptionForm;
  customers: CustomerField[];
}) {
  const initialState: State = { message: null, errors: {} };
  const updatesubscriptionWithId = updatesubscription.bind(null, subscription.id);
  const [state, formAction] = useActionState(updatesubscriptionWithId, initialState);


  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Chọn khách hàng
          </label>
          <div className="relative">
            <select
              id="customer"
              name="customerId"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue={subscription.customer_id}
            >
              <option value="" disabled>
                Chọn một khách hàng
              </option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* subscription Amount */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Chọn số tiền
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                defaultValue={subscription.amount}
                placeholder="Enter USD amount"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* subscription Status */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Đặt trạng thái hóa đơn
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="pending"
                  name="status"
                  type="radio"
                  value="pending"
                  defaultChecked={subscription.status === 'pending'}
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="pending"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  Đang chờ <ClockIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="paid"
                  name="status"
                  type="radio"
                  value="paid"
                  defaultChecked={subscription.status === 'paid'}
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="paid"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Đã nhận <CheckIcon className="h-4 w-4" />
                </label>
              </div>
            </div>
          </div>
        </fieldset>

        {/* Product Type */}
        <div className="mb-4">
          <label htmlFor="productType" className="mb-2 block text-sm font-medium">
            Loại sản phẩm (Tùy chọn)
          </label>
          <input
            id="productType"
            name="productType"
            type="text"
            defaultValue={subscription.product_type || ''}
            placeholder="VD: SIM, Data, v.v..."
            className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
          />
        </div>

        {/* Data Type */}
        <div className="mb-4">
          <label htmlFor="dataType" className="mb-2 block text-sm font-medium">
            Loại dữ liệu (Tùy chọn)
          </label>
          <input
            id="dataType"
            name="dataType"
            type="text"
            defaultValue={subscription.data_type || ''}
            placeholder="VD: 4G, 5G, v.v..."
            className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
          />
        </div>

        {/* Tracking Number */}
        <div className="mb-4">
          <label htmlFor="trackingNumber" className="mb-2 block text-sm font-medium">
            Số theo dõi (Tùy chọn)
          </label>
          <input
            id="trackingNumber"
            name="trackingNumber"
            type="text"
            defaultValue={subscription.tracking_number || ''}
            placeholder="Nhập số theo dõi"
            className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
          />
        </div>

        {/* Package Months */}
        <div className="mb-4">
          <label htmlFor="packageMonths" className="mb-2 block text-sm font-medium">
            Số tháng gói (Tùy chọn)
          </label>
          <input
            id="packageMonths"
            name="packageMonths"
            type="number"
            defaultValue={subscription.package_months || ''}
            placeholder="VD: 12"
            className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
          />
        </div>

        {/* Notes */}
        <div className="mb-4">
          <label htmlFor="notes" className="mb-2 block text-sm font-medium">
            Ghi chú (Tùy chọn)
          </label>
          <textarea
            id="notes"
            name="notes"
            defaultValue={subscription.notes || ''}
            placeholder="Nhập ghi chú"
            rows={3}
            className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/subscriptions"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Hủy bỏ
        </Link>
        <Button type="submit">Ắsąn xếng hóa đơn</Button>
      </div>
    </form>
  );
}
