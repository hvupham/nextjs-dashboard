import { fetchFilteredCustomers } from '@/app/lib/data/index';
import CustomersTable from '@/app/ui/customers/table';
import Search from '@/app/ui/search';
import { Suspense } from 'react';

export default async function Page(props: {
    searchParams?: Promise<{
        query?: string;
        sortBy?: string;
        sortOrder?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const query = searchParams?.query || '';
    const sortBy = searchParams?.sortBy || 'name';
    const sortOrder = (searchParams?.sortOrder || 'ASC') as 'ASC' | 'DESC';

    const customers = await fetchFilteredCustomers(query, sortBy, sortOrder);

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className="text-2xl">Customers</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Search customers..." />
            </div>
            <Suspense fallback={<div>Loading...</div>}>
                <CustomersTable customers={customers} sortBy={sortBy} sortOrder={sortOrder} />
            </Suspense>
        </div>
    );
}