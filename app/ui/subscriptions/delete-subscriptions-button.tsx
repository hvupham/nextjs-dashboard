'use client';

import { TrashIcon } from '@heroicons/react/24/outline';

export function DeletesubscriptionButton({ action }: { action: (formData: FormData) => Promise<void> }) {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        if (!confirm('Bạn có chắc chắn muốn xóa hóa đơn này không? Hành động này không thể hoàn tác.')) {
            e.preventDefault();
        }
    };

    return (
        <form action={action} onSubmit={handleSubmit}>
            <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
                <span className="sr-only">Delete</span>
                <TrashIcon className="w-5" />
            </button>
        </form>
    );
}
