import { fetchProducts } from '@/app/lib/data';
import { CreateProduct } from '@/app/ui/products/buttons';
import ProductsTableComponent from '@/app/ui/products/table';
import { Suspense } from 'react';

export default async function Page() {
  const products = await fetchProducts();

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">Products (Rental)</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <CreateProduct />
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <ProductsTableComponent products={products} />
      </Suspense>
    </div>
  );
}
