'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { updateCustomer } from '@/app/lib/actions/customers';
import { Button } from '@/app/ui/button';
import { Customer } from '@/app/lib/definitions';

export default function EditCustomerForm({ customer }: { customer: Customer }) {
    const updateCustomerWithId = updateCustomer.bind(null, customer.id);
    const [state, formAction] = useActionState(updateCustomerWithId, { errors: {}, message: '' });

    return (
        <form action={formAction} className="space-y-8">
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                {/* Name */}
                <div className="mb-4">
                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-900">
                        Tên khách hàng
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        defaultValue={customer.name || ''}
                        className="block w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900"
                        required
                    />
                    {state.errors?.name && (
                        <div className="text-sm text-red-500">{state.errors.name}</div>
                    )}
                </div>

                {/* Email */}
                <div className="mb-4">
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-900">
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        defaultValue={customer.email || ''}
                        className="block w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900"
                        required
                    />
                    {state.errors?.email && (
                        <div className="text-sm text-red-500">{state.errors.email}</div>
                    )}
                </div>

                {/* Phone */}
                <div className="mb-4">
                    <label htmlFor="phone_number" className="mb-2 block text-sm font-medium text-gray-900">
                        Số điện thoại
                    </label>
                    <input
                        id="phone_number"
                        name="phone_number"
                        type="tel"
                        defaultValue={customer.phone_number || ''}
                        className="block w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900"
                    />
                    {state.errors?.phone_number && (
                        <div className="text-sm text-red-500">{state.errors.phone_number}</div>
                    )}
                </div>

                {state.message && (
                    <div className="mb-4 text-sm text-red-500">{state.message}</div>
                )}
            </div>

            <div className="flex justify-end gap-4">
                <Link
                    href="/dashboard/customers"
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                    Hủy
                </Link>
                <Button type="submit">Cập nhật khách hàng</Button>
            </div>
        </form>
    );
}
