import Link from 'next/link';
import { deleteCustomer } from '@/app/lib/actions/customers';
import { DeleteButton } from './delete-button';

export function CreateCustomer() {
    return (
        <Link
            href="/dashboard/customers/create"
            className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500"
        >
            <span className="hidden md:block">Thêm khách hàng</span>
            <span className="block md:hidden">+</span>
        </Link>
    );
}

export function UpdateCustomer({ id }: { id: string }) {
    return (
        <Link
            href={`/dashboard/customers/${id}/edit`}
            className="rounded-md border border-blue-600 px-2 py-1 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
        >
            Chỉnh sửa
        </Link>
    );
}

export function DeleteCustomer({ id }: { id: string }) {
    const deleteCustomerWithId = deleteCustomer.bind(null, id);

    return (
        <DeleteButton action={deleteCustomerWithId} message="Bạn chắc chắn muốn xóa khách hàng này?" />
    );
}
