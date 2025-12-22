'use client';

export function DeleteButton({ action, message }: { action: (formData: FormData) => Promise<void>; message: string }) {
    return (
        <form action={action}>
            <button
                type="submit"
                className="rounded-md border border-red-600 px-2 py-1 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                onClick={(e) => {
                    if (!confirm(message)) {
                        e.preventDefault();
                    }
                }}
            >
                Xóa
            </button>
        </form>
    );
}
