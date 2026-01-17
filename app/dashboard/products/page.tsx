import { auth } from '@/app/lib/auth';
import { fetchProducts } from '@/app/lib/data';
import { CreateProduct } from '@/app/ui/products/buttons';
import ProductsTableComponent from '@/app/ui/products/table';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';

export default async function Page(props: {
  searchParams?: Promise<{
    sortBy?: string;
    sortOrder?: string;
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

  const products = await fetchProducts(sortBy, sortOrder);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">Products (Rental)</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <CreateProduct />
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <ProductsTableComponent products={products} sortBy={sortBy} sortOrder={sortOrder} />
      </Suspense>
    </div>
  );
}
