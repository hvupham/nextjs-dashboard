import Pagination from '@/app/ui/subscriptions/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/subscriptions/table';
import { Createsubscription } from '@/app/ui/subscriptions/buttons';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { SubscriptionsTableSkeleton } from '@/app/ui/skeletons';
import { fetchSubscriptionsPages } from '@/app/lib/data';
import { Metadata } from 'next';

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
                <h1 className={`${lusitana.className} text-2xl`}>subscriptions</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Tìm kiếm hóa đơn..." />
                <Createsubscription />
            </div>
            <Suspense key={query + currentPage} fallback={<SubscriptionsTableSkeleton />}>
                <Table query={query} currentPage={currentPage} sortBy={sortBy} sortOrder={sortOrder} />
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    );
}