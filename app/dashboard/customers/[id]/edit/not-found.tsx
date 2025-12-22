import Link from 'next/link';

export default function NotFound() {
    return (
        <main className="flex items-center justify-center md:h-screen">
            <div className="relative mx-auto flex w-full max-w-md flex-col space-y-2.5 p-4 md:-mt-32">
                <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 sm:h-24">
                    <div className="w-8 text-white sm:w-10" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Không tìm thấy khách hàng</h2>
                <p className="text-sm text-gray-500">Khách hàng bạn tìm kiếm không tồn tại.</p>
                <Link
                    href="/dashboard/customers"
                    className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-400"
                >
                    Quay lại danh sách khách hàng
                </Link>
            </div>
        </main>
    );
}
