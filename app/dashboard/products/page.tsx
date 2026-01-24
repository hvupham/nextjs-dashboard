import { auth } from '@/app/lib/auth';
import { fetchProducts } from '@/app/lib/data';
import { fetchSIMStatuses } from '@/app/lib/data/sim-statuses';
import { CreateProduct } from '@/app/ui/products/buttons';
import ProductsTableComponent from '@/app/ui/products/table';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export default async function Page(props: {
  searchParams?: Promise<{
    sortBy?: string;
    sortOrder?: string;
    statusFilter?: string;
  }>;
}) {
  const session = await auth();
  
  // Verify user is authenticated
  if (!session?.user) {
    redirect('/login');
  }
  
  const searchParams = await props.searchParams;
  const sortBy = searchParams?.sortBy || 'name';
  const sortOrder = (searchParams?.sortOrder || 'ASC') as 'ASC' | 'DESC';
  const statusFilter = searchParams?.statusFilter ? Number(searchParams.statusFilter) : undefined;

  const products = await fetchProducts(sortBy, sortOrder, statusFilter);
  const simStatuses = await fetchSIMStatuses();

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">Products (Rental)</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <CreateProduct />
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <ProductsTableComponent 
          products={products} 
          sortBy={sortBy} 
          sortOrder={sortOrder}
          simStatuses={simStatuses}
          currentStatusFilter={statusFilter}
        />
      </Suspense>
    </div>
  );
}
