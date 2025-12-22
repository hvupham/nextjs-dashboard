'use client';

import { ProductState, updateProduct } from '@/app/lib/actions/products';
import { ProductForm } from '@/app/lib/definitions';
import { Button } from '@/app/ui/button';
import Link from 'next/link';
import { useActionState } from 'react';

export default function EditProductForm({ product }: { product: ProductForm }) {
  const initialState: ProductState = { message: '', errors: {} };
  const updateProductWithId = updateProduct.bind(null, product.id);
  const [state, formAction] = useActionState(updateProductWithId, initialState);

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Product Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Product Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            defaultValue={product.name}
            placeholder="Enter product name"
            className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="name-error"
          />
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.name &&
              state.errors.name.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Product Type */}
        <fieldset className="mb-4">
          <legend className="mb-2 block text-sm font-medium">
            Product Type
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="sim"
                  name="type"
                  type="radio"
                  value="sim"
                  defaultChecked={product.type === 'sim'}
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                  aria-describedby="type-error"
                />
                <label
                  htmlFor="sim"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1.5 text-xs font-medium text-purple-600"
                >
                  SIM Card
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="pocket-wifi"
                  name="type"
                  type="radio"
                  value="pocket-wifi"
                  defaultChecked={product.type === 'pocket-wifi'}
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="pocket-wifi"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-100 px-3 py-1.5 text-xs font-medium text-green-600"
                >
                  Pocket WiFi
                </label>
              </div>
            </div>
          </div>
          <div id="type-error" aria-live="polite" aria-atomic="true">
            {state.errors?.type &&
              state.errors.type.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </fieldset>

        {/* Monthly Price */}
        <div className="mb-4">
          <label htmlFor="monthly_price" className="mb-2 block text-sm font-medium">
            Monthly Rental Price (¥)
          </label>
          <input
            id="monthly_price"
            name="monthly_price"
            type="number"
            step="100"
            defaultValue={product.monthly_price}
            placeholder="Enter monthly price"
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
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={product.description}
            placeholder="Enter product description"
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
            Stock Quantity
          </label>
          <input
            id="stock"
            name="stock"
            type="number"
            defaultValue={product.stock}
            placeholder="Enter stock quantity"
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
            Status
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
                  Available
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
                  Out of Stock
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
