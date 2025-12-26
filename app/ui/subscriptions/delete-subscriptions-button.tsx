'use client';

import { TrashIcon } from '@heroicons/react/24/outline';

export function DeletesubscriptionButton({ action }: { action: (formData: FormData) => Promise<void> }) {
    return (
        <form action={action}>
            <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
                <span className="sr-only">Delete</span>
                <TrashIcon className="w-5" />
            </button>
        </form>
    );
}
