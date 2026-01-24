'use client';

import { ProductState, updateProduct } from '@/app/lib/actions/products';
import { ProductForm } from '@/app/lib/definitions';
import { Button } from '@/app/ui/button';
import Link from 'next/link';
import { useActionState, useState } from 'react';

interface SIMStatus {
  id: number;
  code: string;
  name_vi: string;
  emoji?: string;
}

export default function EditForm({ product, simStatuses }: { product: ProductForm; simStatuses: SIMStatus[] }) {
  const initialState: ProductState = { message: '', errors: {} };
  const updateProductWithId = updateProduct.bind(null, product.id);
  const [state, formAction] = useActionState(updateProductWithId, initialState);
  const [simType, setSimType] = useState<'physical' | 'multi' | 'esim'>(
    product.sim_type || 'multi'
  );

  return (
    <form action={formAction} noValidate>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* SIM Card Specific Fields */}
        <div className="mb-6 rounded-lg border border-purple-200 bg-purple-50 p-4">
          <h3 className="mb-4 text-sm font-semibold text-purple-900">
            Thông tin SIM Card
          </h3>

          {/* MSN / IMSI */}
          <div className="mb-4">
            <label htmlFor="msn" className="mb-2 block text-sm font-medium">
              MSN / IMSI
            </label>
            <input
              id="msn"
              name="msn"
              type="text"
              placeholder="Ví dụ: 08075220272"
              defaultValue={product.msn || ''}
              className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="msn-error"
            />
            <div id="msn-error" aria-live="polite" aria-atomic="true">
              {state.errors?.msn &&
                state.errors.msn.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* Carrier */}
          <div className="mb-4">
            <label htmlFor="carrier" className="mb-2 block text-sm font-medium">
              Nhà mạng (キャリア)
            </label>
            <input
              id="carrier"
              name="carrier"
              type="text"
              placeholder="Ví dụ: SoftBank, DoCoMo, au"
              defaultValue={product.carrier || ''}
              className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="carrier-error"
            />
            <div id="carrier-error" aria-live="polite" aria-atomic="true">
              {state.errors?.carrier &&
                state.errors.carrier.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* ICCID */}
          <div className="mb-4">
            <label htmlFor="iccid" className="mb-2 block text-sm font-medium">
              ICCID / Serial
            </label>
            <input
              id="iccid"
              name="iccid"
              type="text"
              placeholder="Ví dụ: 8981200791964192111"
              defaultValue={product.iccid || ''}
              className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="iccid-error"
            />
            <div id="iccid-error" aria-live="polite" aria-atomic="true">
              {state.errors?.iccid &&
                state.errors.iccid.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* Capacity */}
          <div className="mb-4">
            <label htmlFor="capacity" className="mb-2 block text-sm font-medium">
              Dung lượng (容量)
            </label>
            <input
              id="capacity"
              name="capacity"
              type="text"
              placeholder="Ví dụ: 50GB, 100GB"
              defaultValue={product.capacity || ''}
              className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="capacity-error"
            />
            <div id="capacity-error" aria-live="polite" aria-atomic="true">
              {state.errors?.capacity &&
                state.errors.capacity.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* SIM Status */}
          <div className="mb-4">
            <label htmlFor="sim_status_id" className="mb-2 block text-sm font-medium">
              Trạng thái SIM
            </label>
            <select
              id="sim_status_id"
              name="sim_status_id"
              defaultValue={product.sim_status_id || ''}
              className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="sim_status_id-error"
            >
              <option value="">-- Chọn trạng thái --</option>
              {simStatuses.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.emoji || ''} {status.name_vi}
                </option>
              ))}
            </select>
            <div id="sim_status_id-error" aria-live="polite" aria-atomic="true">
              {state.errors?.sim_status_id &&
                state.errors.sim_status_id.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* Current Month Usage */}
          <div className="mb-4">
            <label htmlFor="current_month_usage" className="mb-2 block text-sm font-medium">
              Dữ liệu tháng này [G]
            </label>
            <input
              id="current_month_usage"
              name="current_month_usage"
              type="text"
              placeholder="Ví dụ: 18.30"
              defaultValue={product.current_month_usage || ''}
              className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="current_month_usage-error"
            />
            <div id="current_month_usage-error" aria-live="polite" aria-atomic="true">
              {state.errors?.current_month_usage &&
                state.errors.current_month_usage.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* Previous Month Usage */}
          <div className="mb-4">
            <label htmlFor="previous_month_usage" className="mb-2 block text-sm font-medium">
              Dữ liệu tháng trước [G]
            </label>
            <input
              id="previous_month_usage"
              name="previous_month_usage"
              type="text"
              placeholder="Ví dụ: 16.40"
              defaultValue={product.previous_month_usage || ''}
              className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="previous_month_usage-error"
            />
            <div id="previous_month_usage-error" aria-live="polite" aria-atomic="true">
              {state.errors?.previous_month_usage &&
                state.errors.previous_month_usage.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>

        {/* Monthly Price */}
        <div className="mb-4">
          <label htmlFor="monthly_price" className="mb-2 block text-sm font-medium">
            Giá thuê hàng tháng (¥) <span className="text-red-500">*</span>
          </label>
          <input
            id="monthly_price"
            name="monthly_price"
            type="number"
            step="100"
            placeholder="Nhập giá tháng"
            defaultValue={product.monthly_price}
            className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="monthly_price-error"
          />
          <div id="monthly_price-error" aria-live="polite" aria-atomic="true">
            {state.errors?.monthly_price &&
              state.errors.monthly_price.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="mb-2 block text-sm font-medium">
            Mô tả
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            placeholder="Nhập mô tả sản phẩm"
            defaultValue={product.description}
            className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="description-error"
          />
          <div id="description-error" aria-live="polite" aria-atomic="true">
            {state.errors?.description &&
              state.errors.description.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Stock */}
        <div className="mb-4">
          <label htmlFor="stock" className="mb-2 block text-sm font-medium">
            Số lượng tồn kho <span className="text-red-500">*</span>
          </label>
          <input
            id="stock"
            name="stock"
            type="number"
            placeholder="Nhập số lượng tồn kho"
            defaultValue={product.stock}
            className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="stock-error"
          />
          <div id="stock-error" aria-live="polite" aria-atomic="true">
            {state.errors?.stock &&
              state.errors.stock.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Status */}
        <fieldset className="mb-4">
          <legend className="mb-2 block text-sm font-medium">
            Trạng thái <span className="text-red-500">*</span>
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="available"
                  name="status"
                  type="radio"
                  value="available"
                  defaultChecked={product.status === 'available'}
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                  aria-describedby="status-error"
                />
                <label
                  htmlFor="available"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-100 px-3 py-1.5 text-xs font-medium text-green-600"
                >
                  Có sẵn
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="out-of-stock"
                  name="status"
                  type="radio"
                  value="out-of-stock"
                  defaultChecked={product.status === 'out-of-stock'}
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="out-of-stock"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-red-100 px-3 py-1.5 text-xs font-medium text-red-600"
                >
                  Hết hàng
                </label>
              </div>
            </div>
          </div>
          <div id="status-error" aria-live="polite" aria-atomic="true">
            {state.errors?.status &&
              state.errors.status.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </fieldset>

        {state.message && (
          <div className="mb-4" aria-live="polite" aria-atomic="true">
            <p className="text-sm text-red-500">{state.message}</p>
          </div>
        )}
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/products"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Hủy bỏ
        </Link>
        <Button type="submit">Cập nhật sản phẩm</Button>
      </div>
    </form>
  );
}
