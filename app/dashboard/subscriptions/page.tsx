import { fetchSubscriptionsPages } from '@/app/lib/data';
import { lusitana } from '@/app/ui/fonts';
import Search from '@/app/ui/search';
import { SubscriptionsTableSkeleton } from '@/app/ui/skeletons';
import { Createsubscription } from '@/app/ui/subscriptions/buttons';
import Pagination from '@/app/ui/subscriptions/pagination';
import Table from '@/app/ui/subscriptions/table';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
    title: 'subscriptions | Acme Dashboard',
};
export default async function Page(props: {
    searchParams?: Promise<{
        query?: string;
        page?: string;
        sortBy?: string;
        sortOrder?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const sortBy = searchParams?.sortBy || 'date';
    const sortOrder = (searchParams?.sortOrder || 'DESC') as 'ASC' | 'DESC';
    const totalPages = await fetchSubscriptionsPages(query);

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-2xl`}>Đăng ký</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Nhập tên khách hàng..." />
                <Createsubscription />
            </div>
            <Suspense key={`${query}-${currentPage}-${sortBy}-${sortOrder}`} fallback={<SubscriptionsTableSkeleton />}>
                <Table query={query} currentPage={currentPage} sortBy={sortBy} sortOrder={sortOrder} />
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    );
}